# Clip_WebApp

## Initial Setup

```
// 1. Set up Backend
// Create a virtual environment
$ pwd
.../Clip_WebApp/backend
$ python3 -m venv env

// Activate a virtual environment
$ source env/bin/activate

// Install the package dependencies
$ pip install -r requirements.txt

// 2. Set up Frontend
$ pwd
.../Clip_WebApp/clip

$npm install
```

## Start the project

```
// 1. Start backend server
$ pwd
.../Clip_WebApp/backend

$ python classify.py

// 2. Web Browser
$ pwd
.../Clip_WebApp/clip

$ npm run start
```

## About some Folders

```
|-- src
    |-- uploaded_Images (Images uploaded by the user)
        |-- calc_probabilities
        |-- classify_Images
    |-- result_Images (Results save to this folder)
        |-- calc_probabilities
        |-- classify_Images
```
I also put 8 pictures for testing in backend/pics_for_trials

A user flow document: https://docs.google.com/document/d/1n6l46ZTC0VrWBasEWZL2ujBpqH6rFOzJlBHT5boXdnM/edit?usp=sharing
