#import "RCTBridgeModule.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <UIKit/UIKit.h>

#import <AWSCore/AWSCore.h>
#import <AWSS3/AWSS3.h>

@interface ReadImageData : NSObject <RCTBridgeModule>
@end

@implementation ReadImageData

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(readImage:(NSString *)input callback:(RCTResponseSenderBlock)callback)
{
  
  // Create NSURL from uri
  NSURL *url = [[NSURL alloc] initWithString:input];
  
  // Create an ALAssetsLibrary instance. This provides access to the
  // videos and photos that are under the control of the Photos application.
  ALAssetsLibrary *library = [[ALAssetsLibrary alloc] init];
  
  // Using the ALAssetsLibrary instance and our NSURL object open the image.
  [library assetForURL:url resultBlock:^(ALAsset *asset) {
    
    ALAssetRepresentation *representation = [asset defaultRepresentation];
    //CGImageRef imageRef = [representation fullResolutionImage];
    UIImage *imageRef = [UIImage
                         imageWithCGImage:[representation fullScreenImage]
                         scale:[representation scale]
                         orientation:UIImageOrientationUp];
    
    // Create UIImageJPEGRepresentation from CGImageRef
    NSData *imageData = UIImageJPEGRepresentation(imageRef, 0.1);
    
    // Convert to base64 encoded string
    NSString *base64Encoded = [imageData base64EncodedStringWithOptions:0];
    
    callback(@[base64Encoded]);
    
  } failureBlock:^(NSError *error) {
    NSLog(@"that didn't work %@", error);
  }];
  
  
  
}
@end

@interface SaveVideoData : NSObject <RCTBridgeModule>
@end

@implementation SaveVideoData

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(saveVideo:(NSString *)input callback:(RCTResponseSenderBlock)callback)
{
  
  // Create NSURL from uri
  NSURL *fileURL = [[NSURL alloc] initWithString:input];
  
  // Create timestamp for filename
  NSDate *currentDate = [NSDate date];
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  [dateFormatter setDateFormat:@"dd.MM.YY HH:mm:ss"];
  NSString *dateString = [dateFormatter stringFromDate:currentDate];

  // Create strings for filename
  NSString *file = @"videos/bunches-";
  NSString *ext = @".mp4";
  
  // Concatenate string to form filename
  NSArray *myStrings = [[NSArray alloc] initWithObjects:file, dateString, ext, nil];
  NSString *fileName = [myStrings componentsJoinedByString:@""];
  
  
  AWSS3TransferUtility *transferUtility = [AWSS3TransferUtility defaultS3TransferUtility];
  [[transferUtility uploadFile:fileURL
                        bucket:@"bunchesapp"
                           key:fileName
                   contentType:@"video/mp4"
                    expression:nil
              completionHander:nil] continueWithBlock:^id(AWSTask *task) {
    if (task.error) {
      NSLog(@"Error: %@", task.error);
    }
    if (task.exception) {
      NSLog(@"Exception: %@", task.exception);
    }
    if (task.result) {
      //AWSS3TransferUtilityUploadTask *uploadTask = task.result;
      callback(@[fileName]);
    }
    return nil;
  }];

}
@end
