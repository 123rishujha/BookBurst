import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CtrlInput } from "../../../utils/CtrlInput";
import { useBookUserOperationsMutation } from "./BookQuery";
import { BOOK_READING_CONSTANS } from "../../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { MyButton } from "../../../utils/MyButton";
import useS3Upload from "../../../hooks/useS3Upload";
import { FiSearch, FiX } from "react-icons/fi";
import SearchBookForm from "./SearchBookForm";

function BookForm() {
  const { state } = useLocation();
  const [previewLink, setPreviewLink] = useState("");
  const [importMode, setImportMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { handleUploadFileS3 } = useS3Upload();
  const [bookAPI, { isLoading }] = useBookUserOperationsMutation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: state?.title ?? "",
      author: state?.author ?? "",
      coverImage: state?.coverImage ?? null,
      description: state?.description ?? "",
      status: state?.status ?? BOOK_READING_CONSTANS.WantToRead,
      notes: state?.notes ?? "",
      isPublic: state?.isPublic ?? false,
      rating: state?.rating ?? 0,
      googleBookId: state?.googleBookId ?? "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      author: Yup.string().required("Author is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        let bookData = {
          ...values,
          coverImage: previewLink || values.coverImage,
        };
        const response = await bookAPI({
          body: bookData,
          url: state ? `/update/${state._id}` : "/add",
          method: state ? "PUT" : "POST",
        });

        if ([200, 201].includes(response.data?.status_code)) {
          formik.resetForm();
          navigate(-1);
        }
      } catch (error) {
        console.error("Error adding book:", error);
      }
    },
  });

  const searchGoogleBooks = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=5`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("Error searching Google Books:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBookSelect = (book) => {
    const volumeInfo = book.volumeInfo;
    const imageLink = volumeInfo.imageLinks?.thumbnail || "";
  
    // Set form values first
    formik.setValues({
      ...formik.values,
      title: volumeInfo.title || "",
      author: (volumeInfo.authors || []).join(", ") || "",
      description: volumeInfo.description || "",
      coverImage: imageLink,
      googleBookId: book.id,
    });
  
    setPreviewLink(imageLink);
    setImportMode(false);
    
    // Submit the form after setting values
    formik.submitForm();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    formik.resetForm();
    navigate(-1);
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files?.length > 0) {
      try {
        const res = await handleUploadFileS3(files[0], "bookCover");
        if (res?.previewLink) {
          setPreviewLink(res.previewLink);
          formik.setFieldValue("googleBookId", ""); // Clear Google Book ID when uploading custom image
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const toggleImportMode = () => {
    setImportMode(!importMode);
    setSearchQuery("");
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-3 bg-white shadow-md rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <div className="bg-blue-600 w-1 h-5 mr-2 rounded"></div>
          <h2 className="text-lg font-bold text-gray-800">
            {state ? "Edit Book" : "Add New Book"}
          </h2>
        </div>
        <div>
          {!state && (
            <div className="mb-4">
              <MyButton
                type="button"
                onClick={toggleImportMode}
                variant={"secondary"}
                size="small"
              >
                {importMode ? "Create Manually" : "Import from Google Books"}
              </MyButton>
            </div>
          )}
        </div>
      </div>

      {importMode ? (
        <SearchBookForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchGoogleBooks={searchGoogleBooks}
          isSearching={isSearching}
          searchResults={searchResults}
          handleBookSelect={handleBookSelect}
          clearSearch={clearSearch}
        />
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CtrlInput.Normal
                formik={formik}
                name="title"
                label="Book Title"
                placeholder="Enter title"
                className="border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <CtrlInput.Normal
                formik={formik}
                name="author"
                label="Author"
                placeholder="Enter author"
                className="border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <CtrlInput.Select
                formik={formik}
                name="status"
                label="Reading Status"
                className="border-gray-300 rounded text-sm"
                options={Object.values(BOOK_READING_CONSTANS).map((status) => ({
                  value: status,
                  label: status,
                }))}
              />
            </div>

            <div>
              <CtrlInput.File
                formik={formik}
                name="coverImage"
                label="Cover Image"
                accept="image/jpeg,image/png,image/gif"
                handleFileChangeProp={handleFileChange}
              />
              {previewLink && (
                <div className="mt-2 relative">
                  <img
                    src={previewLink}
                    alt="Book cover preview"
                    className="h-20 object-contain border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewLink("");
                      formik.setFieldValue("coverImage", null);
                    }}
                    className="absolute top-0 right-0 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                  >
                    <FiX className="text-gray-700" />
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-2">
              <CtrlInput.MultiLine
                formik={formik}
                name="description"
                label="Book Description"
                placeholder="Brief description..."
                rows={2}
                className="border-gray-300 rounded text-sm"
              />
            </div>

            <div className="col-span-2">
              <CtrlInput.MultiLine
                formik={formik}
                name="notes"
                label="Notes"
                placeholder="Your notes..."
                rows={2}
                className="border-gray-300 rounded text-sm"
              />
            </div>

            <div className="flex items-center col-span-2">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                checked={formik.values.isPublic}
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                Make this book public
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-end gap-2">
              <MyButton
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                variant="secondary"
              >
                Cancel
              </MyButton>
              <MyButton
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
              >
                Submit
              </MyButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default BookForm;
