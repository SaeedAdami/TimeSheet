package com.android.timesheet;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.util.logging.Logger;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //        setContentView(R.layout.database);
        setContentView(R.layout.activity_main);

        //grab controls
        WebView wvMain = (WebView)findViewById(R.id.wvMain);
//        final TextView txtInsertRole = (TextView) findViewById(R.id.txtInsertRole);
//        Button btnInsertRole = (Button) findViewById(R.id.btnInsertRole);

        wvMain.getSettings().setJavaScriptEnabled(true);
        //exception: Denied starting an intent without user gesture
        wvMain.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideKeyEvent(WebView view, KeyEvent event) {
                return false;
            }
        });

        DataAccess dataAccess = new DataAccess(this.getApplicationContext());
        wvMain.addJavascriptInterface(dataAccess, "dataAccess");

        //check if the user already login to the app
        //if (dataAccess.isExistSession() == null)
        wvMain.loadUrl("file:///android_asset/login.html");
        //else
        //    wvMain.loadUrl("file:///android_asset/default.html");


//        btnInsertRole.setOnClickListener(new View.OnClickListener() {
//            public void onClick(View v) {
//                try {
//                    DataAccess dataAccess = new DataAccess(getApplicationContext());
//
//                    dataAccess.deleteRoles(1);
//                    dataAccess.insertRole(1, "Operator");
//                    dataAccess.insertRole(1, "Administrator");
//
//                    Role[] roles = dataAccess.getRoles(1);
//                    for (int i = 0; i < roles.length; i++)
//                    {
//                        Log.d("***--log system--***->",roles[i].UserId + " - " + roles[i].Role);
//                    }
//
//                    Log.d("***--log system--***->","success");
//                }
//                catch (Exception e) {
//                    Log.d("***--log system--***->",e.getMessage());
//                }
//            }
//        });

    }
}
