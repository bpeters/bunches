#import "RCTBridgeModule.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <UIKit/UIKit.h>

#import <AWSCore/AWSCore.h>
#import <AWSS3/AWSS3.h>
#import <AVFoundation/AVFoundation.h>

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
  
  // // Create NSURL from uri
  // NSURL *videoURL = [NSURL URLWithString:input];
  
  // AWSS3TransferManager *transferManager = [AWSS3TransferManager defaultS3TransferManager];
  // AWSS3TransferManagerUploadRequest *uploadRequest = [AWSS3TransferManagerUploadRequest new];
  // uploadRequest.body = videoURL;
  // uploadRequest.key = @"videos/brennen.mp4";
  // uploadRequest.bucket = @"bunchesapp";
  
  // [[transferManager upload:uploadRequest] continueWithBlock:^id(AWSTask *task) {
  //   if (task.error) {
  //     if ([task.error.domain isEqualToString:AWSS3TransferManagerErrorDomain]) {
  //       switch (task.error.code) {
  //         case AWSS3TransferManagerErrorCancelled:
  //         case AWSS3TransferManagerErrorPaused:
  //         {
  //           NSLog(@"Upload failed: [%@]", task.error);
  //         }
  //           break;
            
  //         default:
  //           NSLog(@"Upload failed: [%@]", task.error);
  //           break;
  //       }
  //     } else {
  //       NSLog(@"Upload failed: [%@]", task.error);
  //     }
  //   }
    
  //   if (task.result) {
  //     dispatch_async(dispatch_get_main_queue(), ^{
  //       NSLog(@"Upload ok: [%@]", task.error);
  //     });
  //   }
  //   return nil;
  // }];
  
  
  
  
  
  
  
  
  
  
  // Create NSURL from uri
  NSURL *videoURL = [NSURL URLWithString:input];

  AWSS3TransferManager *transferManager = [AWSS3TransferManager defaultS3TransferManager];
  
  // Create timestamp for filename
  NSDate *currentDate = [NSDate date];
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  [dateFormatter setDateFormat:@"dd.MM.YY-HH:mm:ss"];
  NSString *dateString = [dateFormatter stringFromDate:currentDate];

  // Create strings for filename
  NSString *fileVideo = @"videos/bunches-";
  NSString *fileImage = @"firstFrames/bunches-";
  NSString *fileImageLocal = @"bunches-";
  NSString *extVideo = @".mp4";
  NSString *extImage = @".png";

  // Concatenate string to form filenames
  // Remote video image name
  NSArray *vids = [[NSArray alloc] initWithObjects:fileVideo, dateString, extVideo, nil];
  NSString *fileNameVideo = [vids componentsJoinedByString:@""];

  // Remote image name
  NSArray *imgs = [[NSArray alloc] initWithObjects:fileImage, dateString, extImage, nil];
  NSString *fileNameImage = [imgs componentsJoinedByString:@""];
  
  // Local image name
  NSArray *imgsLocal = [[NSArray alloc] initWithObjects:fileImageLocal, dateString, extImage, nil];
  NSString *fileNameImageLocal = [imgsLocal componentsJoinedByString:@""];

  // Grab first frame of video
  AVURLAsset *asset = [[AVURLAsset alloc] initWithURL:videoURL options:nil];
  AVAssetImageGenerator *generate = [[AVAssetImageGenerator alloc] initWithAsset:asset];
  generate.appliesPreferredTrackTransform = YES;
  NSError *err = NULL;
  CMTime time = CMTimeMake(1, 10);
  CGImageRef ref = [generate copyCGImageAtTime:time actualTime:NULL error:&err];
  UIImage *firstFrameBig = [[UIImage alloc] initWithCGImage:ref];

  // // Compress image
  UIImage *firstFrame = [UIImage imageWithData:UIImageJPEGRepresentation(firstFrameBig, 0.5)];

  // Convert image to NSURL 
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *filePath = [[paths objectAtIndex:0] stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.png", fileNameImageLocal]];
  [UIImagePNGRepresentation(firstFrame) writeToFile:filePath atomically:YES];

  NSURL *imageURL = [NSURL fileURLWithPath:filePath];
 
 // Upload video
  AWSS3TransferUtility *transferVideo = [AWSS3TransferUtility defaultS3TransferUtility];
  [[transferVideo uploadFile:videoURL
                       bucket:@"bunchesapp"
                          key:fileNameVideo
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
      //callback(@[fileNameVideo]);
    }
    return nil;
  }];

  // Upload first frame
  AWSS3TransferUtility *transferImage = [AWSS3TransferUtility defaultS3TransferUtility];
  [[transferImage uploadFile:imageURL
                        bucket:@"bunchesapp"
                           key:fileNameImage
                   contentType:@"image/png"
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
      callback(@[fileNameVideo,fileNameImage]);
    }
    return nil;
  }];

}
@end
