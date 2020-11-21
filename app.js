const database = firebase.firestore();
const phoneBook = database.collection('phonebook');
const table = document.querySelector('.table-body');
const removeTableElementBtn = document.querySelector('.btn-floating');
const firstNameInput = document.querySelector('#first_name');
const lastNameInput = document.querySelector('#last_name');
const phoneNumberInput = document.querySelector('#phone_number');
const submitBtbn = document.querySelector('.my-submit');
const form = document.querySelector('.my-form'); 
const inputField = document.querySelector('.my-input');
const errorParagraph = document.querySelector('.error-paragraph');


// CREATING AND APPENDING A TABLE ROW TO THE TABLE BODY 
let renderPerson = (doc) => {
    let iconClasses = ['btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'pink', 'lighten-1'];
    let tr = document.createElement('tr');
    let fNameTd = document.createElement('td');
    let lNameTd = document.createElement('td');
    let phoneTd = document.createElement('td');
    let removeTd = document.createElement('td');
    let removeLink = document.createElement('a');
    let removeIcon = document.createElement('i');
    removeIcon.classList.add('material-icons');
    removeIcon.innerText = "clear"
    removeLink.classList.add(...iconClasses);
    removeLink.appendChild(removeIcon);
    removeTd.appendChild(removeLink);
    fNameTd.innerText = doc.data().firstname;
    lNameTd.innerText = doc.data().lastname;
    phoneTd.innerText = doc.data().phone;
    tr.appendChild(fNameTd);
    tr.appendChild(lNameTd);
    tr.appendChild(phoneTd);
    tr.appendChild(removeTd);
    tr.setAttribute('id', doc.id)
    table.appendChild(tr)
}

// FUNCTION TO WRITE DATA (ADD A PERSON) TO THE CLOUD DATABASE
let createPerson = () => {
    phoneBook.add({
        firstname:firstNameInput.value,
        lastname:lastNameInput.value,
        phone:phoneNumberInput.value
    })
    .then(docRef => {
        console.log(`Success, created with Id`, docRef.id)
    })
    .catch(err=> console.log(err));
}


let showError = () => {
    errorParagraph.classList.remove('hide');
    errorParagraph.innerText = `One or more fields are empty`;
    setTimeout(()=>{
        errorParagraph.classList.add('hide');
    }, 2000)
}

phoneBook.orderBy('firstname').onSnapshot(snapshot=>{
    let changes = snapshot.docChanges()
    
    changes.forEach(change=>{
         if(change.type == "added"){
             renderPerson(change.doc)
         }
         else if(change.type == "removed"){
             let tr = table.querySelector('[id=' + change.doc.id + ']')
             table.removeChild(tr) 
         }
    }) 
})

// REMOVING DATA (A PERSON) FROM THE CLOUD DATABASE 
table.addEventListener('click', (e)=>{
   if(e.target.classList.contains('material-icons')){
        let trId = e.target.parentElement.parentElement.parentElement.id
        phoneBook.doc(`${trId}`).delete()
        .then(()=> console.log(`Document Succesfully Deleted`))
        .catch(e=> console.log(e, 'something happened')); 
   }
})

// WRITING DATA FROM THE FRONT END / UI AND CALLING THE CREATE USER FUNCTION WHEN ADD USER BUTTON GETS CLICKED
submitBtbn.addEventListener('click', e=>{
    e.preventDefault();
    if(firstNameInput.value !== "" && lastNameInput.value !== "" && phoneNumberInput.value !== ""){
        createPerson()
        firstNameInput.value =   "";
        lastNameInput.value =    "";
        phoneNumberInput.value = "";
        inputField.blur();  // I'M TRYING TO REMOVE THE FOCUS FROM THE INPUT FIELDS AFTER A USER CLICKS THE SUBMIT BUTTON. DOESN'T WORK LOL
    }
    else{
        showError();
    }
})