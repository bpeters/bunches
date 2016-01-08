package com.bunches;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

// Added for camera
import com.facebook.react.CompositeReactPackage;
import com.lwansbrough.ReactCamera.ReactCameraPackage;

// Added for CodePush
import com.microsoft.codepush.react.CodePush;


// Added for Icons
import com.smixx.reactnativeicons.ReactNativeIcons;  // <--- import
import java.util.Arrays; // <--- import this if you want to specify which fonts to load
import com.smixx.reactnativeicons.IconFont; // <--- import this if you want to specify which fonts to load


// Added for Parse
import com.parse.Parse;

// Added for VideoPreview
import com.brentvatne.react.ReactVideoPackage;


public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);

        CodePush codePush = new CodePush("mmtzbrYrru6M28Ngw-0NiAqbLpvYEJXL5qzrg", this);

        Parse.initialize(this);

        // ParseObject testObject = new ParseObject("TestObject");
        // testObject.put("foo", "bar");
        // testObject.saveInBackground();


        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setJSBundleFile(codePush.getBundleUrl("index.android.bundle"))
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new ReactCameraPackage(this))
                .addPackage(new ReactNativeIcons())
                .addPackage(new ReactVideoPackage())
                .addPackage(codePush.getReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        // mReactInstanceManager = ReactInstanceManager.builder()
        //         .setApplication(getApplication())
        //         .setBundleAssetName("index.android.bundle")
        //         .setJSMainModuleName("index.android")
        //         .addPackage(new MainReactPackage())
        //         .setUseDeveloperSupport(BuildConfig.DEBUG)
        //         .setInitialLifecycleState(LifecycleState.RESUMED)
        //         .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "bunches", null);

        setContentView(mReactRootView);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }
    }
}
