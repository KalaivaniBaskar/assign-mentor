import express from "express"; 
import { postNewStudent, postNewMentor, getAllMentors, getAllStudents, getStudentsCount, getStudentById, getMentorById, getMentorsCount, editStudent, editMentor, getUnassignedStudents, updateStudentsMany } from "../Controllers/students.js";

const router = express.Router(); 

 // adding new student 
 router.post('/students/add', async(req,res) => {
    try{
        const newStudent = req.body;
        // console.log(newStudent);
        let sid = await getStudentsCount();
        // console.log(sid, typeof sid);
        sid = "S"+(sid+1);
        let addStudent = {...newStudent, studentID:sid}
        // console.log(addStudent);
        if(!newStudent){
          return res.status(400)
              .json({message:"No details provided"})
        }
        const result= await postNewStudent(addStudent);
        if(!result){
          return res.status(400)
              .json({message:"error posting data"})
        }
        res.status(201).json({added:result});
    }
    catch(error){
       res.status(500).json({message:"Internal server error", "error":error})
    }
    })

    //get all students 
    router.get("/students/all", async(req,res) => {
        if(req.query.experience){
           req.query.experience = parseInt(req.query.experience);
        }
       try{
         const students = await getAllStudents(req);
         if(students.length===0){
               return res.status(400).json({message:"No student data available"})
         }
         res.status(200).json({StudentsList:students});
       }
       catch(error){
          res.status(500).json({message:"Internal server error", "error":error})
       }
       }) 

       //get all students with no mentor assigned
    router.get("/students/all/unassigned", async(req,res) => {
       try{
         const students = await getUnassignedStudents(req.body);
         if(students.length===0){
               return res.status(400).json({message:"No student data available"})
         }
         res.status(200).json({StudentsList:students});
       }
       catch(error){
          res.status(500).json({message:"Internal server error", "error":error})
       }
       }) 

  //update student
  router.put('/students/edit/:id', async(req,res) => {
    try{
        console.log("editing student data");
       const {id} = req.params;
       const updatedStudent = req.body;
       //console.log(id, updatedStudent);
       if(!id || !updatedStudent){
           return res.status(400)
           .json({message:"Wrong request"})
       }
       const found =await getStudentById(id.trim()); 
       //console.log(found);
       let changed = {...updatedStudent, hasMentor:"true", previous_Mentor: found.assigned_Mentor}
       //console.log(changed);
       const result = await editStudent(id.trim(),changed)
       if(!result || !result.lastErrorObject.updatedExisting){
          return res.status(400)
          .json({message:"ERROR updating "})
      }
      res.status(200).json({UpdatedMentor : id, new:changed, status: result});
    }
    catch(error){
       res.status(500).json({message:"Internal server error","error":error})
    }
    })

    //update many students
  router.put('/students/edit/many/:id', async(req,res) => {
   try{
       console.log("editing students data");
      const {id} = req.params;
      const {target, assign} = req.body;
      //console.log(target, assign);
      if(!id || !target){
          return res.status(400)
          .json({message:"Wrong request"})
      }
      //const found =await getMentorById(id.trim()); 
      //console.log(found);
      //console.log(target,data);
      const result = await updateStudentsMany(target,assign)
      //console.log(result);
      if(!result || !result.acknowledged || result.matchedCount !== target.length){
         return res.status(400)
         .json({message:"ERROR updating ",status:result})
     }
     res.status(200).json({UpdatedStudents : target, mentor:assign, status: result});
   }
   catch(error){
      res.status(500).json({message:"Internal server error","error":error})
   }
   })

    /////////////////////MENTORS////////////////////

    // adding new mentors 
 router.post('/mentors/add', async(req,res) => {
    try{
        const newMentor = req.body;
         //console.log(newMentor);
        let mid = await getMentorsCount();
         //console.log(mid, typeof mid);
         mid = "M"+(mid+1);
        let addMentor = {...newMentor, mentorID:mid}
        // console.log(addMentor);
        if(!newMentor){
          return res.status(400)
              .json({message:"No details provided"})
        }
        const result= await postNewMentor(addMentor);
        if(!result){
          return res.status(400)
              .json({message:"error posting data"})
        }
        res.status(201).json({added:result});
    }
    catch(error){
       res.status(500).json({message:"Internal server error", "error":error})
    }
    })

    //get all mentors 
    router.get("/mentors/all", async(req,res) => {
      
       try{
         const mentors = await getAllMentors(req);
         if(mentors.length===0){
               return res.status(400).json({message:"No mentor data available"})
         }
         res.status(200).json({MentorsList:mentors});
       }
       catch(error){
          res.status(500).json({message:"Internal server error", "error":error})
       }
       }) 

       //update mentor - add students 
  router.put('/mentors/edit/:id', async(req,res) => {
    try{
        console.log("editing mentors");
       const {id} = req.params;
       const updateMentor = req.body; 
       //console.log(id,...updateMentor);
       if(!id || !updateMentor){
           return res.status(400)
           .json({message:"Wrong request "})
       }
       //console.log("heere",id, typeof id);
       const found =await getMentorById(id.trim()); 
       //console.log(found);
       let changed = found.mentee;
       changed = [...changed, ...updateMentor] 
       //console.log("changed",changed);
       const data = {mentee: changed};
       const result = await editMentor(id.trim(),data);
       if(!result || !result.lastErrorObject.updatedExisting){
          return res.status(400)
          .json({message:"ERROR updating ",status: result})
      }
      res.status(200).json({UpdatedStudent :changed, status: result});
    }
    catch(error){
       res.status(500).json({message:"Internal server error","error":error})
    }
    })

    //update mentor - remove students 
  router.put('/mentors/edit-mentee/:id', async(req,res) => {
    try{
       console.log("editing mentee");
       const {id} = req.params;
       const removeStudent = req.body; 
       //console.log(id, removeStudent.studentID);
       if(!id || !removeStudent){
           return res.status(400)
           .json({message:"Wrong request "})
       }
       //console.log("heere",id, typeof id);
       const found =await getMentorById(id.trim()); 
       //console.log(found);
       let changed = found.mentee;
       changed = changed.filter( (el) => el.studentID != removeStudent.studentID)
       //console.log("changed",changed);
       const data = {mentee: changed};
       const result = await editMentor(id.trim(),data);
       if(!result || !result.lastErrorObject.updatedExisting){
          return res.status(400)
          .json({message:"ERROR updating ",status: result})
      }
      res.status(200).json({UpdatedMentor:id, UpdatedMentee :changed, status: result});
    }
    catch(error){
       res.status(500).json({message:"Internal server error","error":error})
    }
    })

    //get previously assigned mentor for a student
    router.get("/students/find/:id", async(req,res) => {
       
       try{
         const {id} = req.params;
         const student = await getStudentById(id.trim());
         if(student === null || student.length===0){
               return res.status(400).json({message:"No student data available"})
         }
         res.status(200).json({Student:student});
       }
       catch(error){
          res.status(500).json({message:"Internal server error", "error":error})
       }
       }) 

       //get mentees for a mentor
    router.get("/mentors/find/:id", async(req,res) => {
       
        try{
          const {id} = req.params;
          const mentor = await getMentorById(id.trim());
          if(mentor === null || mentor.length===0){
                return res.status(400).json({message:"No mentor data available"})
          }
          res.status(200).json({Mentor:mentor});
        }
        catch(error){
           res.status(500).json({message:"Internal server error", "error":error})
        }
        }) 

    //exporting 
    export const studentRouter = router; 
