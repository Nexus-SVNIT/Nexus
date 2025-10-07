import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
import Modal from '@mui/joy/Modal/Modal';
import { toast } from 'react-hot-toast'; // Import toast

const AlumniMenu = () => {
  const [open, setOpen] = useState(false);
  const [AlumniDetails, setAlumniDetails] = useState({
    'Name': '',
    'E-Mail': '',
    'Admission No': '',
    'Expertise': '',
    'Current Role': '',
    'Company Name': '',
    'Mobile Number': '',
    'Passing Year': '',
    'LinkedIn': '',
    'codeforcesId': '',
    'LeetcodeId': '',
    'shareCodingProfile': false,
  });
  const [file, setFile] = useState(null); // Use 'file' instead of 'image'

  // File input handler
  const handleImageChange = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setFile(file); // Set the file state
    }
  };

  const formFields = [
    { 'label': 'Name', 'value': '', 'placeholder': 'Enter your name' },
    { 'label': 'E-Mail', 'value': '', 'placeholder': 'Enter your email' },
    { 'label': 'Admission No', 'value': '', 'placeholder': 'U2XCSXXX' },
    { 'label': 'Expertise', 'value': '', 'placeholder': 'React,AWS,MicroServices' },
    { 'label': 'Current Role', 'value': '', 'placeholder': 'Software Developer Engineer @ xyz' },
    { 'label': 'Company Name', 'value': '', 'placeholder': 'Enter your company name' },
    { 'label': 'Mobile Number', 'value': '', 'placeholder': 'Enter your mobile number' },
    { 'label': 'Passing Year', 'value': '', 'placeholder': 'Enter your passing year' },
    { 'label': 'LinkedIn', 'value': '', 'placeholder': 'Enter your LinkedIn profile' },
    { 'label': 'codeforcesId', 'value': '', 'placeholder': 'Enter your Codeforces ID' },
    { 'label': 'LeetcodeId', 'value': '', 'placeholder': 'Enter your Leetcode ID' },
    { 'label': 'shareCodingProfile', 'value': false, 'placeholder': '' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAlumniDetails({ ...AlumniDetails, [name]: type === 'checkbox' ? checked : value });
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/add`,
        {
          method: "POST",
          body: formData,
          headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
        },
        

      );
      if (!response.ok) {
        let errorMessage = 'Something went wrong';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (error) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Your details have been submitted successfully!");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(`Something went wrong! ${error.message}`);
      setOpen(false);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpen(true);

    const formData = new FormData();
    formData.append('Name', AlumniDetails['Name']);
    formData.append('E-Mail', AlumniDetails['E-Mail']);
    formData.append('Admission No', AlumniDetails['Admission No']);
    formData.append('Expertise', AlumniDetails['Expertise']);
    formData.append('Current Role', AlumniDetails['Current Role']);
    formData.append('Company Name', AlumniDetails['Company Name']);
    formData.append('Mobile Number', AlumniDetails['Mobile Number']);
    formData.append('Passing Year', AlumniDetails['Passing Year']);
    formData.append('LinkedIn', AlumniDetails['LinkedIn']);
    if (AlumniDetails['codeforcesId']) {
      formData.append('codeforcesId', AlumniDetails['codeforcesId']);
    }
    if (AlumniDetails['LeetcodeId']) {
      formData.append('LeetcodeId', AlumniDetails['LeetcodeId']);
    }
    formData.append('shareCodingProfile', AlumniDetails['shareCodingProfile']);
    if (file) {
      formData.append('ImageLink', file); // Append the file with the key 'file'
    }

    mutation.mutate(formData);
  };

  return (
    <section className='mx-auto mb-48 mt-10 flex h-auto max-w-5xl items-center overflow-hidden rounded-md bg-blue-100/10'>
      <Modal
        aria-describedby="modal-desc"
        open={open}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
        }}
      >
        <div
          id="modal-desc"
          className="mx-4 flex min-h-[10rem] flex-col items-center justify-center rounded-lg border-none bg-black/70 pb-8 transition-all w-[18rem] md:w-[16rem] md:gap-4"
        >
          {mutation.isPending ? (
            <div className='h-16'>
              <Loader />
              <p className='flex items-center justify-center md:w-full text-white'>
                Uploading Your Details...
              </p>
            </div >
          ) : mutation.isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="w-3/4 text-center text-sm text-white">
                Your Details are under Review.
              </p>
              <Link to="/alumni-network" className="rounded-sm bg-blue-600/50 px-4 py-2">
                OK
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="text-center text-sm text-white md:w-3/4">
                Something went wrong!!
              </p>
              <button onClick={() => setOpen(false)} className="rounded-sm bg-blue-600/50 px-4 py-2">
                Try Again
              </button>
            </div>
          )}
        </div>
      </Modal>

      <form className="mb-10 flex w-full max-w-5xl flex-col items-center justify-center px-10 py-6" onSubmit={handleSubmit}>
        <h4 className="mb-6 text-xl font-bold">Alumni Information</h4>
        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex flex-col items-center justify-center md:w-3/4">
            <label htmlFor="file" className="cursor-pointer" title="Select a file">
              <img
                src={file ? URL.createObjectURL(file) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrO6oGyxrMasnTJFJSt86C3Ecac3kTHtrbQ&usqp=CAU"}
                alt="profile"
                className="h-40 w-40 rounded-full object-cover object-center md:h-52 md:w-52"
              />
            </label>
            <input type="file" accept="image/*" name="file" id="file" hidden onChange={handleImageChange} />
            <p className="mt-4 text-xs text-gray-400">Note: Your file will be shown as above*</p>
          </div>
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-8">
            {formFields.map((field) => (
              <div key={field.label} className="m-4 flex w-full flex-col gap-2 md:w-fit">
                <label htmlFor={field.label} className="uppercase">
                  {field.label} {field.label !== 'codeforcesId' && field.label !== 'LeetcodeId' && <span className="text-red-800">{" *"}</span>}
                </label>
                {field.label === 'shareCodingProfile' ? (
                  <input
                    type="checkbox"
                    id={field.label}
                    name={field.label}
                    onChange={handleChange}
                    className="w-full border-b border-blue-600 bg-transparent outline-none md:w-[20rem]"
                  />
                ) : (
                  <input
                    type="text"
                    id={field.label}
                    placeholder={field.placeholder}
                    name={field.label}
                    onChange={handleChange}
                    required={field.label !== 'codeforcesId' && field.label !== 'LeetcodeId'}
                    className="w-full border-b border-blue-600 bg-transparent outline-none md:w-[20rem]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <button className="mt-10 bg-blue-600 px-8 py-4 hover:bg-blue-700" type="submit">
          Submit Your Details
        </button>
      </form>
    </section>
  );
};

export default AlumniMenu;