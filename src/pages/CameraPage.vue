<template>
    <q-page class="constrain-more q-pa-md">
        <div class="camera-frame q-pa-md">
            <video v-show="!imageCaptured" ref="video" class="auto-width" autoplay playsinline></video>
            <canvas v-show="imageCaptured" ref="canvas" class="full-width" height="240"></canvas>
        </div>
        <div class="text-center q-pa-md">
            <q-btn v-if="hasCameraSupport" @click="captureImage" color="grey-10" size="lg" icon="eva-camera" round />
            <q-file v-else outlined v-model="imageUpload" label="Choose an image" accept="image/*"
                @change="captureImageFallback">
                <template v-slot:prepend>
                    <q-icon name="eva-attach-outline" />
                </template>
            </q-file>
            <div class="row justify-center q-ma-md">
                <q-input v-model="post.caption" class="col col-sm-6" label="Caption" dense />
            </div>
            <div class="row justify-center q-ma-md">
                <q-input v-model="post.location" class="col col-sm-6" label="Location" dense>
                    <template v-slot:append>
                        <q-btn round dense flat icon="eva-navigation-2-outline" />
                    </template>
                </q-input>
            </div>
            <div class="row justify-center q-mt-lg">
                <q-btn unelevated rounded color="primary" label="Post Image" @click="submitPost" />
            </div>
        </div>
    </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { uid } from 'quasar';

const post = ref({
    id: uid(),
    caption: '',
    location: '',
    photo: null,
    date: Date.now(),
});

const imageCaptured = ref(false);
const imageUpload = ref(null);
const hasCameraSupport = ref(true);

const video = ref(null);
const canvas = ref(null);

const initCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                if (video.value) {
                    video.value.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Error accessing the camera: ", err);
                hasCameraSupport.value = false;
            });
    } else {
        console.error("getUserMedia not supported by this browser.");
        hasCameraSupport.value = false;
    }
};

const captureImage = () => {
    if (video.value && canvas.value) {
        const videoElement = video.value;
        const canvasElement = canvas.value;
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        post.value.photo = canvasElement.toDataURL('image/png');
        imageCaptured.value = true;
        post.value.photo = dataURItoBlob(canvasElement.toDataURL());
        disableCamera();
    }
};

const captureImageFallback = () => {
    if (!imageUpload.value) return; // Ensure the file is selected
    const file = imageUpload.value;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvasElement = canvas.value;
            const context = canvasElement.getContext('2d');
            canvasElement.width = img.width;
            canvasElement.height = img.height;
            context.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
            post.value.photo = canvasElement.toDataURL('image/png');
            imageCaptured.value = true;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};


const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};

const submitPost = () => {
    console.log(post.value);
    // Add your logic to handle the post submission
};

// Initialize the camera when the component is mounted
onMounted(() => {
    initCamera();
});
</script>



<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px

.auto-width
  width: 100%
</style>
