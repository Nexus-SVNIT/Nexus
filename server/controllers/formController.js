const mongoose = require('mongoose');
const Forms = mongoose.model('form');

const handleError = (res, err) => {
    console.error(err);
    res.status(500).json(err);
};

const getPublicForms = async (req, res) => {
    try {
        const allForms = await Forms.find({ publish: true })
            .select({
                "responseCount": { $size: "$responses" },
                name: true,
                desc: true,
                deadline: true,
                formFields: true,
                _event: true
            });
        res.status(200).json(allForms);
    } catch (err) {
        handleError(res, err);
    }
};
const getAllForms = async (req, res) => {
    try {
        const allForms = await Forms.find()
            .select({
                "responseCount": { $size: "$responses" },
                name: true,
                deadline: true,
                publish: true
            })
            .sort({ created_date: -1 }); // Sort by creation date, descending
        res.status(200).json(allForms);
    } catch (err) {
        handleError(res, err);
    }
};

const updateFormStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { publish } = req.body;
  
      // Validate input
      if (typeof publish !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Invalid input' });
      }
  
      // Find the form and update its status
      const form = await Forms.findById(id);
      if (!form) {
        return res.status(404).json({ success: false, message: 'Form not found' });
      }
  
      form.publish = publish;
      await form.save();
  
      res.json({ success: true, message: 'Form status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  const updateFormDeadline = async (req, res) => {
    try {
      const { id } = req.params;
      const { deadline } = req.body;

      
  
      // Validate input
      if (!deadline || !/^\d{2}-\d{2}-\d{4}$/.test(deadline)) {
        return res.status(400).json({ success: false, message: 'Invalid deadline format. Expected format: DD-MM-YYYY' });
      }
  
      // Find the form and update its deadline
      const form = await Forms.findById(id);
      if (!form) {
        return res.status(404).json({ success: false, message: 'Form not found' });
      }
  
      form.deadline = deadline;
      await form.save();
  
      res.json({ success: true, message: 'Form deadline updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
 
  
  


  const createForm = async (req, res) => {
    const { name, desc, deadline, formFields, WaLink } = req.body;
    
    const _event = "none";  // Set a default value for _event if it's not provided

    // Convert deadline to dd-mm-yy format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = String(date.getFullYear()); 
        return `${day}-${month}-${year}`;
    };

    const formattedDeadline = formatDate(deadline);
    const created_date = new Date().toISOString();
    const publish = false;  

    try {
        const createdForm = await Forms.create({
            name,
            desc,
            deadline: formattedDeadline,
            created_date,
            publish,
            formFields,
            WaLink,
            _event
        });
        res.status(200).json(createdForm);
    } catch (err) {
        handleError(res, err);
    }
};



const submitResponse = async (req, res) => {
    const id = req.params.id;
    const { email } = req.body;

    try {
        // Check if the deadline has not been missed
        const formDetails = await Forms.findById(id).select({ deadline: true, WaLink: true });
        const deadlineDate = formDetails.deadline;
        const currentDate = Date.now();
        if (deadlineDate < currentDate) {
            // If the deadline has been missed, send an error response
            return res.status(400).json({
                success: false,
                message: "The deadline has passed. Your response was not saved.",
            });
        }

        // Check if the email already exists in the specific form's responses
        const existingResponse = await Forms.findOne({ _id: id, "responses.email": email });

        if (existingResponse) {
            // If email already exists in this form's responses, send an error response
            return res.status(400).json({
                success: false,
                message: "Email already exists. Your response was not saved.",
            });
        }

        // If email doesn't exist and the deadline has not been missed, proceed with updating the form
        const form = await Forms.findByIdAndUpdate(
            id,
            { $push: { responses: req.body } },
            { new: true }
        );

        const responseMessage = {
            success: true,
            message: "Your response has been successfully saved.",
            WaLink: form?.WaLink,
        };

        res.status(200).json(responseMessage);
    } catch (err) {
        handleError(res, err);
    }
};




const getResponses = async (req, res) => {
    const id = req.params.id;
    try {
        const responses = await Forms.findById(id).select({ responses: true, _id: false });
        if (!responses) throw new Error("Event not found");
        res.status(200).json(responses);
    } catch (err) {
        handleError(res, err);
    }
};

const getFormFields = async (req, res) => {
    const id = req.params.id;
    try {
        const formFields = await Forms.findById(id).select({ _id: false, responses: false, __v: false, responseCount: false, _event: false });
        if (!formFields) throw new Error("Event not found");
        res.status(200).json(formFields);
    } catch (err) {
        handleError(res, err);
    }
};

module.exports = { getAllForms, getPublicForms, createForm, submitResponse, getResponses, getFormFields ,updateFormStatus,updateFormDeadline};
