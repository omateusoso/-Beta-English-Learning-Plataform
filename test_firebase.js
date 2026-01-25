try {
    require('firebase/app');
    console.log("Firebase found");
} catch (e) {
    console.log("Firebase NOT found");
    console.error(e.message);
}
