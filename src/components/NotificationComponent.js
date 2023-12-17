import axios from "axios";

export const requestPermission = () =>{
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      navigator.serviceWorker.ready.then((sw) => {
        sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "BKpp3bZGmXDPhvW4Zxf9CBybvQ6oH4gKOEfybeid60ncfQ61E7LQxs70sNOyX9sXcS5C-03nju19QwlYq5vsSQQ"
        }).then((subscription) =>{
          insertToken(JSON.stringify(subscription));
        });
      })
    }
  });
}

const insertToken = async (currentToken) => {
  try{
    const url = localStorage.getItem("url") + "users.php";
    const userId = localStorage.getItem("userId");
    const jsonData = {userId: userId, token: currentToken};
    const formData = new FormData();
    // console.log("url: " + url, "\njsonData: " + JSON.stringify(jsonData), "\ntoken: " + currentToken);
    
    formData.append("json", JSON.stringify(jsonData));
    formData.append("operation", "insertToken");

    const res = await axios({url: url, data: formData, method: "post"});
    if(res.data === 1){
      console.log("Successfully added the token to the database");
    }else{
      console.log("unsuccessful insert token, res: " , JSON.stringify(res.data))
    }
  }catch(err){
    alert("There was an error: " + err);
  }
}