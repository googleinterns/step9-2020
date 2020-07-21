package com.google.sps;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.sps.utils.Ad;
import com.google.sps.utils.StateCollectionBuilder;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class StateCollectionBuilderTest {

  private static Firestore db; 
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com";

  @Test
  public void getSortedAds_emptyStateString_emptyMap() throws Exception {
    String state = "";
    Map<String, ArrayList> advertiserToAdIds = getAdvertiserToAdIdsMap(state);
    Assert.assertEquals(advertiserToAdIds.isEmpty(), true);
  }

  @Test
  public void getSortedAds_invalidState_emptyMap() throws Exception {
    String state = "Cauliflower";
    Map<String, ArrayList> advertiserToAdIds = getAdvertiserToAdIdsMap(state);
    Assert.assertEquals(advertiserToAdIds.isEmpty(), true);
  }

  @Test
  public void getSortedAds_validState_everyAdvertiserValueHasIdList() throws Exception {
    String state = "New York";
    Map<String, ArrayList> advertiserToAdIds = getAdvertiserToAdIdsMap(state);
    for (String key : advertiserToAdIds.keySet()) {
      Assert.assertEquals(advertiserToAdIds.get(key).isEmpty(), false);
    }
  }

  public Map<String, ArrayList> getAdvertiserToAdIdsMap(String state) throws Exception {
    initializeApp();
    ApiFuture<QuerySnapshot> future = db.collection("states")
                                        .whereArrayContains("geoTarget", state)
                                        .get();
    List<QueryDocumentSnapshot> documents = future.get().getDocuments();
    return StateCollectionBuilder.getSortedAds(state, documents);
  }

  public static void initializeApp() throws Exception {
    FileInputStream serviceAccount = new FileInputStream(PATH_TO_SERVICE_ACCOUNT);
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .setDatabaseUrl(DATABASE_URL)
        .build();
    
    // Initialize app.
    if (FirebaseApp.getApps().isEmpty()) {
      FirebaseApp.initializeApp(options);
    }
    db = FirestoreClient.getFirestore();
  }
}
