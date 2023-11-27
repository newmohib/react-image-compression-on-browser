// import React from 'react';
// import imageCompression from 'browser-image-compression';


// const ImageCompress = ()=>{


//     async function handleImageUpload(event) {

//         const imageFile = event.target.files[0];
//         console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
//         console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
//         // you should provide one of maxSizeMB, maxWidthOrHeight in the options
// // const options: Options = { 
// //     maxSizeMB: number,            // (default: Number.POSITIVE_INFINITY)
// //     maxWidthOrHeight: number,     // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
// //                                   // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
// //                                   // Please check the Caveat part for details.
// //     onProgress: Function,         // optional, a function takes one progress argument (percentage from 0 to 100) 
// //     useWebWorker: boolean,        // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
// //     libURL: string,               // optional, the libURL of this library for importing script in Web Worker (default: https://cdn.jsdelivr.net/npm/browser-image-compression/dist/browser-image-compression.js)
// //     preserveExif: boolean,        // optional, use preserve Exif metadata for JPEG image e.g., Camera model, Focal length, etc (default: false)

// //     signal: AbortSignal,          // optional, to abort / cancel the compression

// //     // following options are for advanced users
// //     maxIteration: number,         // optional, max number of iteration to compress the image (default: 10)
// //     exifOrientation: number,      // optional, see https://stackoverflow.com/a/32490603/10395024
// //     fileType: string,             // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
// //     initialQuality: number,       // optional, initial quality value between 0 and 1 (default: 1)
// //     alwaysKeepResolution: boolean // optional, only reduce quality, always keep width and height (default: false)
// //   }

// //   imageCompression(file: File, options: Options): Promise<File>

//         const options = {
//           maxSizeMB: 1,
//           maxWidthOrHeight: 1920,
//           useWebWorker: true,
//         }
//         try {
//           const compressedFile = await imageCompression(imageFile, options);
//           console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
//           console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

//           //await uploadToServer(compressedFile); // write your own logic
//         } catch (error) {
//           console.log(error);
//         }

//       }

//     return(
//         <div>Hellow</div>
//     )

// }

// export default ImageCompress



import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { Card,Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageCompressor = () => {
    const [compressedLink, setCompressedLink] = useState(
        "placeholder.png"
    );
    const [originalImage, setOriginalImage] = useState("");
    const [originalLink, setOriginalLink] = useState("");
    const [outputFileName, setOutputFileName] = useState("");
    const [clicked, setClicked] = useState(false);
    const [uploadImage, setUploadImage] = useState(false);
    const [errorObj, setErrorObj] = useState({issError: false, message:""});

    const handle = (e) => {
        const imageFile = e.target.files[0];
        setOriginalLink(URL.createObjectURL(imageFile));
        setOriginalImage(imageFile);
        setOutputFileName(imageFile.name);
        setUploadImage(true);
    };

    const click = async (e) => {
        e.preventDefault();

        const options = {
            maxSizeMB: 0.100,
            maxWidthOrHeight: 200,
            useWebWorker: true,
        };

        if (options.maxSizeMB >= originalImage.size / 1024) {
            // alert("Image is too small, can't be Compressed!");
            setErrorObj({issError: true, message:"Image is too small, can't be Compressed!"})
            return;
        }

        let compressedFile = await imageCompression(originalImage, options);
        //await uploadToServer(compressedFile); // write your own logic
        const downloadLink = URL.createObjectURL(compressedFile);
        setCompressedLink(downloadLink);

        setClicked(true);
    };

    useEffect(() => {
        // Perform any additional actions after component is mounted or state is updated
    }, [originalLink, compressedLink, clicked]);

    return (
        <div className="m-5">
            <div className="text-black text-center">
                <h1>Three Simple Steps</h1>
                <h3>1. Upload Image</h3>
                <h3>2. Click on Compress</h3>
                <h3>3. Download Compressed Image</h3>
                <div className="row mt-1">
                    {errorObj.issError && <Alert variant="danger" dismissible={true}>
                        {errorObj.message}
                        </Alert>}
                </div>
                <div className="row mt-2">
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                        <input
                            type="file"
                            accept="image/*"
                            className="btn btn-secondary mt-2"
                            onChange={(e) => handle(e)}
                        />
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                        {outputFileName &&
                            <button
                                type="button"
                                className="btn btn-dark mt-2 "
                                onClick={(e) => click(e)}
                            >
                                Compress
                            </button>
                        }
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                        {clicked &&
                            <a
                                href={compressedLink}
                                download={outputFileName}
                                className="btn btn-primary mt-2"
                            >
                                Download
                            </a>
                        }
                    </div>
                </div>
            </div>

            <div className="row mt-5 bg-secondary p-2">
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <div className="d-flex justify-content-center">

                    </div>
                    {uploadImage ? (
                        <Card.Img className="ht" variant="top" src={originalLink} />
                    ) : (
                        <Card.Img
                            className="ht"
                            variant="top"
                            src="placeholder.png"
                        />
                    )}
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <Card.Img variant="top" src={compressedLink} />
                </div>
            </div>
        </div>
    );
};

export default ImageCompressor;
