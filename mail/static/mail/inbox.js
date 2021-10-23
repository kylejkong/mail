



document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#read-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  

  document.querySelector('#compose-form').onsubmit = () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value,
          
      })
    })
    .then(response => response.json())
    .then(() => {
        load_mailbox('sent');
    });

    
    return false;
  };
 
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-email').style.display = 'none';

  //show the mail box name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      
      for(let email of emails){
        if(email.archived && mailbox == 'inbox'){
         // pass
        }
        //display inbox items that arent already archived
        else{

        const unread_img = "<img src=\"https://cdn-icons-png.flaticon.com/512/855/855502.png\" width=\"30px\" height=\"30px\">"
        const read_img ="<img src=\"https://cdn-icons-png.flaticon.com/512/1161/1161724.png\"  width=\"30px\" height=\"30px\">"
        

        const mail = document.createElement('div');
        mail.setAttribute("class", 'border border-secondary mt-3 rounded-top', tabIndex="-1");
        mail.className = 'mailDiv';
        mail.id="second";
        // mail.innerHTML = '<button class="hide" name="btn">Hide</button>'; 
        
        
        //if email is read. set background to grey , if unread white.
        
          
        var sender_span = document.createElement('span');
        sender_span.setAttribute("class","text-left");
        sender_span.innerHTML += 'From: ' + email.sender  ;   
        mail.appendChild(sender_span); //append sender_span to mail div


        var timestamp_span = document.createElement('span');
        timestamp_span.setAttribute("class", "float-right");
        timestamp_span.innerHTML += " On " + email.timestamp ; 
        mail.appendChild(timestamp_span); //append timestamp_span to mail div

        var subject_span = document.createElement('span');
        subject_span.innerHTML += "<pre>" + 'Subject: ' + email.subject + "</pre>";
        mail.appendChild(subject_span); //append subject_span to mail div


      //   $(document).on('click', '.hide' , event => {
      //     const element = event.target;
      //     if (element.className === 'mailDiv') {
      //         element.parentElement.style.animationPlayState = 'running';
      //         element.parentElement.addEventListener('animationend', 
      //         () => {
      //           fetch('/emails/'+`${email.id}`, {
      //             method: 'PUT',
      //             body: JSON.stringify({
      //                 archived: !(email.archived)
                      
      //             })
                 
      //         })
      //         }
      //         )
              
              
      //     }
      // } ) 
        
 




      var archiveMail = document.createElement('button');
      archiveMail.setAttribute("class", 'btn btn-warning', tabIndex="-1" ,  role = "button" , onclick="event.stopPropagation();");
      archiveMail.style = 'float:right';
      archiveMail.className = 'hide';
      archiveMail.textContent = email.archived ? "Unarchive" : "Archive";
      document.querySelector('#emails-view').appendChild(archiveMail)

    //   archiveMail.addEventListener('click', event => {
   
    //     const element = event.target;
    //     if (element.className === 'hide') {
    //         element.parentElement.style.animationPlayState = 'running';
    //         element.parentElement.addEventListener('animationend', () => {
    //           fetch('/emails/'+`${email.id}`, {
    //             method: 'PUT',
    //             body: JSON.stringify({
    //                 archived: !(email.archived)
                    
    //             })
               
    //         })
    //         })(load_mailbox("inbox"))
    //     }
    // } )


      // function archive(){
  

      //   const element = event.target;
      //   if (element.className === 'hide'){
      //     element.parentElement.style.animationPlayState = 'running';
      //   element.parentElement.addEventListener('animationend', () => {
      //     fetch('/emails/'+`${email.id}`, {
      //       method: 'PUT',
      //       body: JSON.stringify({
      //           archived: !(email.archived)
                
      //       })
           
      //   })
      //   })
      //   }
        
      // }
      
      
      // $(".hide").click(function(e){
      //   e.stopPropagation() 

      //   const element = event.target;
      //   if (element.className === 'hide'){
      //     element.parentElement.style.animationPlayState = 'running';
      //     element.parentElement.addEventListener('animationend', ()=>{
      //       fetch('/emails/'+`${email.id}`, {
      //         method: 'PUT',
      //         body: JSON.stringify({
      //             archived: !(email.archived)
                  
      //         })
             
      //     })
      //     })
      //   }


      // });
        

//   document.addEventListener('click', event => {
//     const element = event.target;
//     if (element.className === 'hide') {
//         element.parentElement.style.animationPlayState = 'running';
//         element.parentElement.addEventListener('animationend', () => {
//           fetch('/emails/'+`${email.id}`, {
//             method: 'PUT',
//             body: JSON.stringify({
//                 archived: !(email.archived)
                
//             })
           
//         })
//         }).then(location.reload(true))
//         .then(() => load_mailbox('inbox'))
//     }
// } )


   
       
        
   
        
        archiveMail.addEventListener('click', ()=>{
          
          fetch('/emails/'+`${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: !(email.archived)
                
            })
           
        })
         
          .then(() => load_mailbox('inbox')) //goes back to director 'inbox' 
          .then(alert(email.archived ? 'Mail Unarchived' : 'Mail Archived'))
        })
      
      
         

          // $("#mailDiv").finish().hide(1000)
          // $("#archiveB").finish().hide(1000)
          // $('#mailDiv').delay(10000).queue(function(){
          //   $('#mailDiv').fadeOut('slow')
          // })
          // $('#archiveB').delay(10000).queue(function(){
          //   $('#archiveB').fadeOut('slow')
          // })
           //if mail is archived, alert mail unarchived is triggered.
         
           
          // //if mail is archived, alert mail unarchived is triggered.
         
        // $("#archiveB").click(()=>{
        //   $("#archiveB").hide("slow",()=>{
        //     $("#mailDiv").hide("slow", ()=>{
        //       fetch('/emails/'+`${email.id}`, {
        //         method: 'PUT',
        //         body: JSON.stringify({
        //             archived: !(email.archived)
                    
        //         })
               
        //     })
  
        //     })
        //   })
          
        //   // .then(location.reload(true))
         
        // })
      

        // $("#archiveB").click(()=>{
          
        //     $("#mailDiv").hide("slow", ()=>{
        //       fetch('/emails/'+`${email.id}`, {
        //         method: 'PUT',
        //         body: JSON.stringify({
        //             archived: !(email.archived)
                    
        //         })
               
        //     })
  
        //     })
          
          
        //   // .then(location.reload(true))
         
        // })
      
        
        // $(document).on('click', '#archiveB', ()=>{
        //   $("#mailDiv").hide("slow", ()=>{
        //     fetch('/emails/'+`${email.id}`, {
        //       method: 'PUT',
        //       body: JSON.stringify({
        //           archived: !(email.archived)
                  
        //       })
             
        //   })

        //   })
        // })
 
        email.read ? mail.style.backgroundColor = 'LightGrey': mail.style.backgroundColor = 'White';
        email.read? mail.innerHTML += read_img : mail.innerHTML += unread_img;
        
        document.querySelector('#emails-view').append(mail); //append mail div to 'emails-view'
        mail.addEventListener('click', () => load_email(email)); //click to run load email function
        
        


      }
      }
    })
  
  }



  function load_email(email) {
     
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#read-email').style.display = 'block';
    
 

       // fetch and display email
    fetch('/emails/'+`${email.id}`)
    .then(response => response.json())
    .then(email => {
        document.querySelector('#read-email').innerHTML = `<h3> Subject: ${email.subject}</h3>`;
        
        
      


        const emailDiv = document.createElement('div');
        emailDiv.setAttribute("class", "border border-primary rounded-lg");
        emailDiv.innerHTML += "From: " + email.sender + "<br />";
        emailDiv.innerHTML += "Recipients: ";
        for (let recipient of email.recipients) {
        emailDiv.innerHTML += recipient +"<br />";
        }
        emailDiv.innerHTML += " "+ "Sent on " + email.timestamp + "<br />";
        
        

        const ContentDiv = document.createElement('div');
        ContentDiv.setAttribute("class", "border rounded-lg");
        ContentDiv.innerHTML += email.body + "<br />";
        document.querySelector('#read-email').append(emailDiv);
        document.querySelector('#read-email').append(ContentDiv);
        

      


        const replyButton = document.createElement('button'); // reply button
        replyButton.setAttribute("class", "btn btn-info");
        replyButton.textContent = "Reply";
        document.querySelector('#read-email').append(replyButton);
  
        replyButton.addEventListener('click', () => {
          compose_email(); // reply clicked => email composition form
  
          // prefill form (reply case)
          document.querySelector('#compose-recipients').value = email.sender;
          document.querySelector('#compose-subject').value = email.subject.slice(0,4) == 'Re: ' ? 'Re: ' + email.subject.slice(4,) : 'Re: ' + email.subject;
          document.querySelector('#compose-body').value = email.sender + 'wrote ' + email.body + ' ' + 'on ' + email.timestamp;
        });
        
        const archiveMail = document.createElement('button');
        archiveMail.setAttribute("class", 'btn btn-warning');
        archiveMail.textContent = "Archive";
        document.querySelector('#read-email').append(archiveMail);

        archiveMail.addEventListener('click', ()=>{
          fetch('/emails/'+`${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: !(email.archived)
            })

        })
        .then(alert(email.archived ? 'Mail Unarchived' : 'Mail Archived')) //if mail is archived, alert mail unarchived is triggered.
        .then(() => load_mailbox('inbox')); //goes back to director 'inbox'
      });

 

    });
    
   

    // mark email as read
    if (!email['read']) {
      fetch('/emails/' + `${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({ read : true })
      })
    }
    
    
  }




  
