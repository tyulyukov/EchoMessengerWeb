import{e as s,u as o,f as i}from"./index.b7986cbb.js";const a=s("auth/login",{state:()=>({error:null,loading:!1,internalError:null}),actions:{logIn(A,r){this.$reset();const t=o();this.loading=!0,fetch(t.combineUrl("auth/login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:A,password:r})}).then(e=>{if(this.loading=!1,e&&e.status===200)return e.json();if(e&&e.status===400){this.error="Incorrect username/password";return}else if(e&&e.status===500){this.error="Server error";return}}).then(e=>{e&&e.user&&e.token&&(i().updateUser(e.user),t.rememberJwt(e.token),this.$router.push({path:"/"}))}).catch(e=>{this.loading=!1,this.internalError=e,this.error="No connection..."})}}}),m="data:image/png;base64,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";export{m as _,a as u};
