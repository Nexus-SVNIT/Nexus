const getSubjects = async (req, res) => {
    try {
        const { category, department } = req.query;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const filter = { category: category.trim() };

        if (category === "Semester Exams") {
            if (!department) {
                return res.status(400).json({ message: "Department is required for Semester Exams" });
            }
            filter.department = department.trim();
        }

        if (category === "Placements/Internships") {
            filter.department = "Common";
        }

        
        res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=86400");

        const subjects = await Subject.find(filter)
            .select("_id subjectName")
            .lean();

        return res.status(200).json({
            message: "Subjects fetched successfully",
            data: subjects
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching subjects" });
    }
};
