const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key {8868cf5e8c6d4b60a720467f51088fcc}');

stub.PostModelOutputs(
  {
    // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
    model_id: 'a5d7776f0c064a41b48c3ce039049f65',
    inputs: [
      {
        data: {
          image: {
            url:
              'https://www.byrdie.com/thmb/m9TjzttAMMs6r8FtAXvECQrCH4g=/500x350/filters:no_upscale():max_bytes(150000):strip_icc()/promo-f479f33fd9304b3997cc0f7c97c1a245-1aebc5f0ea88447e840db1f8fd67f802.jpg',
          },
        },
      },
    ],
    metadata,
  },
  (err, response) => {
    if (err) {
      console.log('Error: ' + err);
      return;
    }

    if (response.status.code !== 10000) {
      console.log(
        'Received failed status: ' +
          response.status.description +
          '\n' +
          response.status.details
      );
      return;
    }

    console.log('Predicted concepts, with confidence values:');
    for (const c of response.outputs[0].data.concepts) {
      console.log(c.name + ': ' + c.value);
    }
  }
);
