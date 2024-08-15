<template>
    <q-page class="constrain-more q-pa-md">
        <div class="camera-frame q-pa-md">
            <video v-show="!imageCaptured" ref="video" class="auto-width" autoplay playsinline></video>
            <canvas v-show="imageCaptured" ref="canvas" class="full-width" height="240"></canvas>
        </div>
        <div class="text-center q-pa-md">
            <!--Camera Access Accepted-->
            <q-btn v-if="hasCameraSupport" @click="captureImage" color="grey-10" size="lg" icon="eva-camera" round />

            <!--Camera Access refused-->
            <q-file v-else outlined v-model="imageUpload" label="Choose an image" accept="image/*"
                @input="captureImageFallback" filled>
                <template v-slot:prepend>
                    <q-icon name="eva-attach-outline" />
                </template>
            </q-file>

            <div class="row justify-center q-ma-md">
                <q-input v-model="post.caption" class="col col-sm-6" label="Caption" dense />
            </div>
            <div class="row justify-center q-ma-md">
                <q-input v-model="post.location" :loading="locationLoading" class="col col-sm-6" label="Location" dense>
                    <template v-slot:append>
                        <q-btn v-if="!locationLoading && locationSupported" round dense flat
                            icon="eva-navigation-2-outline" @click="getLocation" />
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { uid } from "quasar";
import axios from 'axios';


const post = ref({
    id: uid(),
    caption: "",
    location: "",
    photo: null,
    date: Date.now(),
});

const imageCaptured = ref(false);
const imageUpload = ref([]);
const hasCameraSupport = ref(true);

const video = ref(null);
const canvas = ref(null);
let stream = null;

let locationLoading = false;

const locationSupported = computed(() => 'geolocation' in navigator);

const initCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(localStream => {
                stream = localStream;
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

// const initCamera = () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//             .then(stream => {
//                 if (video.value) {
//                     video.value.srcObject = stream;
//                 }
//             })
//             .catch(err => {
//                 console.error("Error accessing the camera: ", err);
//                 hasCameraSupport.value = false;
//             });
//     } else {
//         console.error("getUserMedia not supported by this browser.");
//         hasCameraSupport.value = false;
//     }
// };

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

const disableCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
};


const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
        disableCamera();
    } else if (!imageCaptured.value) {
        initCamera();
    }
};

const captureImageFallback = (event) => {
    if (event && event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                if (canvas.value) {
                    const canvasElement = canvas.value;
                    const context = canvasElement.getContext("2d");

                    // Set canvas dimensions to image dimensions
                    canvasElement.width = img.width;
                    canvasElement.height = img.height;
                    context.drawImage(img, 0, 0);

                    // Update the post's photo with the new image
                    post.value.photo = canvasElement.toDataURL("image/png");
                    imageCaptured.value = true;
                }
            };
            img.src = event.target.result;
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
    }
};

const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};


//location functions
const getLocation = () => {
    locationLoading = true;
    navigator.geolocation.getCurrentPosition(position => {
        getCityAndCountry(position)
    }, err => {
        locationError();
    }, { timeout: 7000 });
}

const getCityAndCountry = (position) => {
    const apiURL = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`;
    axios.get(apiURL)
        .then(result => {
            locationSuccess(result);
        })
        .catch(err => {
            locationError();
        });
};
const locationSuccess = (result) => {
    post.value.location = result.data.city;
    if (result.data.country) {
        post.value.location += `, ${result.data.country}`;
    }
    locationLoading = false;
};
const locationError = () => {
    const $q = useQuasar();

    function alert() {
        $q.dialog({
            title: 'Error',
            message: 'Coud not find your location'
        });
        locationLoading = false;
    }
}

const submitPost = () => {
    console.log(post.value);
    // Add your logic to handle the post submission
};


//lifecycle hooks
// Initialize the camera when the component is mounted
onMounted(() => {
    initCamera();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener("beforeunload", disableCamera);
});

// Clean up event listeners and stop the camera when the component is unmounted
onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener("beforeunload", disableCamera);
    disableCamera();
});

</script>

<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px

.auto-width
  width: 100%
</style>
