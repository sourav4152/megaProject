/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

export default function Upload({
    name,
    label,
    register,
    setValue,
    errors,
    video = false,
    viewData = null,
    editData = null,
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(
        viewData ? viewData : editData ? editData : ""
    );
    const inputRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: !video
            ? { "image/*": [".jpeg", ".jpg", ".png"] }
            : { "video/*": [".mp4", ".mov"] },
        onDrop,
    });

    // Use a new useEffect to handle the file preview
    useEffect(() => {
        if (selectedFile) {
            if (video) {
                setPreviewSource(URL.createObjectURL(selectedFile));
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                reader.onloadend = () => {
                    setPreviewSource(reader.result);
                };
            }
        }
    }, [selectedFile, video]);

    // The rest of the useEffects and code remain the same
    useEffect(() => {
        register(name, { required: true });
    }, [register]);

    useEffect(() => {
        setValue(name, selectedFile);
    }, [selectedFile, setValue]);

    useEffect(() => {
        return () => {
            if (previewSource && video) {
                URL.revokeObjectURL(previewSource);
            }
        };
    }, [previewSource, video]);

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5 uppercase tracking-wider" htmlFor={name}>
                {label} {!viewData && <sup className="text-pink-200">*</sup>}
            </label>
            <div
                className={`${isDragActive ? "bg-richblack-600" : "bg-richblack-700"}
                flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
            >
                {previewSource ? (
                    <div className="flex w-full flex-col p-6">
                        {!video ? (
                            <img
                                src={previewSource}
                                alt="Preview"
                                className="h-full w-full rounded-md object-cover"
                            />
                        ) : (
                            // MODIFIED: Updated <video> tag attributes for manual control
                            <video
                                src={previewSource}
                                controls
                                muted
                                loop={false}
                                autoPlay={false}
                                className="h-full w-full rounded-md object-cover"
                            />
                        )}
                        {!viewData && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewSource("");
                                    setSelectedFile(null);
                                    setValue(name, null);
                                }}
                                className="mt-3 text-richblack-400 underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ) : (
                    <div
                        className="flex w-full flex-col items-center p-6"
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} ref={inputRef} />
                        <div className="grid aspect-square w-14 place-items-center rounded-full bg-richblack-800">
                            <FiUploadCloud className="text-2xl text-yellow-50" />
                        </div>
                        <p className="mt-2 max-w-[200px] text-center text-xs text-richblack-200 uppercase tracking-wider">
                            Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    inputRef.current.click();
                                }}
                                className="font-semibold text-yellow-50 cursor-pointer"
                            >
                                Browse
                            </span>{" "}
                            a file
                        </p>
                        <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200 uppercase tracking-wider">
                            <li>Aspect ratio 16:9</li>
                            <li>Recommended size 1024x576</li>
                        </ul>
                    </div>
                )}
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    );
}