function exam(){
    getPreferences(); //pulls 
    clearExam();
    if(preferences.endless){createEndless();}
    else{myLines.push(createExam());}
    uploadExam();
    startExam();
}