import {client} from '../db.js';

export function postNewStudent(data){
    return client
    .db("zenb42")
    .collection("students")
    .insertOne(data)
}
export function postNewMentor(data){
    return client
    .db("zenb42")
    .collection("mentors")
    .insertOne(data)
}
export function getAllStudents(req){
    return client
    .db("zenb42")
    .collection("students")
    .find(req.query)
    .toArray();
}
export function getAllMentors(req){
    return client
    .db("zenb42")
    .collection("mentors")
    .find(req.query)
    .toArray();
}
export function getStudentsCount(){
    return client
    .db("zenb42")
    .collection("students")
    .estimatedDocumentCount();
}
export function getMentorsCount(){
    return client
    .db("zenb42")
    .collection("mentors")
    .estimatedDocumentCount();
}
export function getStudentById(id){
    return client
    .db("zenb42")
    .collection("students")
    .findOne({studentID:id});
}
export function getMentorById(id){
    return client
    .db("zenb42")
    .collection("mentors")
    .findOne({mentorID:id});
}
export function editStudent(id,data){
    return client
    .db("zenb42")
    .collection("students")
    .findOneAndUpdate({studentID:id},{$set:data});
}
export function editMentor(id,data){
    return client
    .db("zenb42")
    .collection("mentors")
    .findOneAndUpdate({mentorID:id},{$set:data});
}
export function getUnassignedStudents(){
    return client
    .db("zenb42")
    .collection("students")
    .find({hasMentor:"false"})
    .toArray();
}