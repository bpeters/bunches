#import "RCTBridgeModule.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <UIKit/UIKit.h>

#import "Parse/Parse.h"

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

RCT_EXPORT_METHOD(saveVideo:(NSString *)input)
{
  
  // Create NSURL from uri
  NSURL *url = [[NSURL alloc] initWithString:input];
  
  NSData *videoData = [NSData dataWithContentsOfFile:url];
  
  // Save the image to Parse
  PFFile *imageFile = [PFFile fileWithName:@"bunches.mp4" data:videoData];
  
  [imageFile saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (!error) {
      // The image has now been uploaded to Parse. Associate it with a new object
      PFObject* newPhotoObject = [PFObject objectWithClassName:@"PhotoObject"];
      [newPhotoObject setObject:imageFile forKey:@"image"];
      
      [newPhotoObject saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
        if (!error) {
          NSLog(@"Saved");
        }
        else{
          // Error
          NSLog(@"Error: %@ %@", error, [error userInfo]);
        }
      }];
    }
  }];
  
}
@end