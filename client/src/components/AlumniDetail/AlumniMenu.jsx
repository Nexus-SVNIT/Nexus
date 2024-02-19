import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
import Modal from '@mui/joy/Modal/Modal';

const AlumniMenu = () => {
  const [open, setOpen] = useState(false);
  const [AlumniDetails, setAlumniDetails] = useState({
    'Name': '',
    'E-Mail': '',
    'Admission No': '',
    'Expertise': '',
    'Current Role': '',
    'Mobile Number': '',
    'Passing Year': '',
    'LinkedIn': '',
  })
  const [image, setImage] = useState(null);
  const formFields = [
    {
      'label': 'Name',
      'value': '',
      'placeholder': 'Enter your name'
    },
    {
      'label': 'E-Mail',
      'value': '',
      'placeholder': 'Enter your email'
    },
    {
      'label': 'Admission No',
      'value': '',
      'placeholder': 'U2XCSXXX'
    },
    {
      'label': 'Expertise',
      'value': '',
      'placeholder': 'React,AWS,MicroServices'
    },

    {
      'label': 'Current Role',
      'value': '',
      'placeholder': 'SOftware Developer Engineer @ xyz'
    },
    {
      'label': 'Mobile Number',
      'value': '',
      'placeholder': 'Enter your mobile number'
    },
    {
      'label': 'Passing Year',
      'value': '',
      'placeholder': 'Enter your passing year'
    },
    {
      'label': 'LinkedIn',
      'value': '',
      'placeholder': 'Enter your LinkedIn profile'
    }
  ]


  const handleChange = (e) => {
    setAlumniDetails({ ...AlumniDetails, [e.target.name]: e.target.value })
  }

  const handleImageChange = (event) => {
    try {
      const file = event?.target?.files?.[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);

        }
      };
      reader?.readAsDataURL(file);
    } catch (error) {
      return;
    }
  };
  const mutation = useMutation({
    mutationFn: (newAchievement) => {
      return fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/add`,
        {
          method: "POST",
          body: JSON.stringify(newAchievement),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpen(true);
    mutation.mutate({ ...AlumniDetails, ImageLink: image });
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
          className={`mx-4 flex min-h-[10rem] flex-col items-center justify-center rounded-lg border-none bg-black/70 pb-8  transition-all w-[18rem] md:w-[16rem] md:gap-4`}
        >
          {mutation.isPending ? (
            <>
              <Loader />
              <p className='flex items-center justify-center md:w-full text-white'>
                Uploading Your Details...
              </p>

            </>
          ) : mutation.isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="w-3/4  text-center text-sm text-white">
                Your Details are under Review.
              </p>
              <Link
                to={"/connect"}
                className="rounded-sm bg-blue-600/50 px-4 py-2"
              >
                OK
              </Link>
            </div>
          ) : mutation?.data?.success === 'false' ? <div className="flex flex-col items-center justify-center gap-4 text-white">
            <p className="text-center text-sm text-white md:w-3/4">
              {mutation.data.message}
            </p>
            <button
              onClick={(e) => setOpen(false)}
              className="rounded-sm bg-blue-600/50 px-4 py-2"
            >
              Try Again
            </button>
          </div> : (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="text-center text-sm text-white md:w-3/4">
                Something went wrong!!
              </p>
              <button
                onClick={(e) => setOpen(false)}
                className="rounded-sm bg-blue-600/50 px-4 py-2"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </Modal>
      <form className='mb-10 flex w-full max-w-5xl flex-col items-center justify-center px-10 py-6' onSubmit={handleSubmit}>
        <h4 className='mb-6 text-xl font-bold'>Alumni Information</h4>
        <div className='flex flex-col items-center justify-center p-2'>
          <div className="flex flex-col items-center justify-center md:w-3/4">
            <label
              htmlFor="image"
              className="cursor-pointer"
              title="Select an image"
            >
              <img
                src={
                  image ??
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrO6oGyxrMasnTJFJSt86C3Ecac3kTHtrbQ&usqp=CAU"
                }
                alt="profile"
                className="h-40 w-40 rounded-full object-cover object-center md:h-52 md:w-52"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              id="image"
              hidden
              required
              onChange={handleImageChange}
            />
            <p className="mt-4 text-xs text-gray-400">
              Note: Your image will be showed as above*
            </p>
          </div>
          <div className='mx-auto mt-8  flex flex-wrap items-center justify-center gap-8'>
            {formFields.map((field) => (
              <div key={field.label} className='m-4 flex w-full flex-col gap-2 md:w-fit'>
                <label htmlFor={field.label} className='uppercase'>
                  {field.label}
                  <span className='text-red-800'>{" *"}</span>
                </label>
                <input
                  type='text'
                  id={field.label}
                  placeholder={field.placeholder}
                  name={field.label}
                  onChange={handleChange}
                  required
                  className='w-full border-b border-blue-600 bg-transparent outline-none md:w-[20rem]' />
              </div>
            ))}
          </div>
        </div>
        <button className='mt-10 bg-blue-600 px-8 py-4 hover:bg-blue-700' type='submit'>
          Submit Your Details
        </button>
      </form>
    </section>
  )
}

export default AlumniMenu
