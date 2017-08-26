# QuickNoms Mobile App

5 ingredients. 15 minutes. Minimal setup. Recipes for all!

This mobile app and website are built to display recipes entered on the web, stored in Firebase, and displayed in real-time after they are approved in the database. It is built with NativeScript for the mobile app and the Angular CLI for the web and powered by Firebase on the backend. 

The idea behind QuickNoms is that, with just five ingredients, you can prepare a nutritious meal with a little planning and some good recipes in short order.

The QuickNoms app is paired with the QuickNoms web site at [QuickNoms.com](http://www.quicknoms.com/). To run this app, you will need to get several API keys in order to use the more advanced functionality pairing machine learning with recipes. However to simply view recipes, clone the repo and, with NativeScript installed locally, run `tns run ios` or `tns run android`. On Android, your emulator will need to have Google Play Services enabled.

This app has several special features:

- Search, powered by Algolia
- Text-to-Speech - read me a recipe
- Announcement marquee at the top - announcing new recipes, powered by Firebase's Remote Config module
- A bluetooth module (in development) - get local temperature from a connected device and get recipe recommendations
- Two machine learning modules, accessible from the FAB button dropdown on the top right of the home screen: 

    - "QuickNom or Not" - take a photo of a plate of food and, using Clarif.ai's 'food' model, determine whether the dish qualifies as a QuickNom (does it have its ingredients listed clearly)
    - "Store Module" - take a photo of an ingredient and find matching recipes, if available

I hope you enjoy QuickNoms!

