# widgetPublisher

## Frontend deploy

yarn build; firebase deploy

## Backend deploy

gcloud builds submit --tag gcr.io/widget-publisher/widget-publisher

gcloud beta run deploy --image gcr.io/widget-publisher/widget-publisher --port 5000