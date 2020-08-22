package pl.mind_app.mindapp;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;


public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{

       // add(GoogleAuth.class);
        add(CapacitorFirebaseAuth.class);

    }});

  }
}
