import React, { useState } from 'react'

const QuestionBox = ({ ques, index, setCurrSelectedQuestion, addQuestion, open }) => {
  const [isOpen, setIsOpen] = useState(open)
  return (<>
    <div className='flex flex-col gap-2 p-6 px-10  bg-white rounded-lg  mt-4 text-gray-800'>
      <div className='flex gap-4 justify-between'>

        {
          isOpen ? <input type="text" placeholder={ques.questionText} className='outline-none border-b-2 w-2/3' /> :
            <h2 className='w-full'>{ques.questionText}</h2>
        }
        {
          isOpen && <div className='mx-2 flex gap-2'>
            <label htmlFor="questionType">Choose Type:</label>
            <select name="questionType" id="questionType" className='outline-none border px-4 py-1 '>
              <option value="option1" >Text</option>
              <option value="option2">Radio</option>
              <option value="option3">Date</option>
            </select>
          </div>
        }
      </div>

      {
        !ques.open && <div>
          <input type="text" className='outline-none w-2/3 border-b-2' />
        </div>
      }

    </div>
    {
      ques.open && <div className='w-full h-10 bg-white/10 my-4 text-gray-600 text-lg flex items-center justify-center hover:bg-white/20 hover:text-gray-400 cursor-pointer' onClick={addQuestion}>Create New Question</div>
    }
  </>
  )
}

export default QuestionBox