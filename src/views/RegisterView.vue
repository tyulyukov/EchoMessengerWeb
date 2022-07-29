<template>
  <main class="auth-form">
    <img class="logo" src="/src/assets/echo.png">
    <h1>Get Started!</h1>
    <p class="note">Register your account</p>
    <form>
      <div class="input-group">
        <label>Username</label>
        <input id="username" class="form-control" type="text" autocomplete="false">
      </div>

      <div class="input-group">
        <label>Password</label>
        <input id="password" class="form-control" type="password">
      </div>

      <div class="input-group">
        <label>Repeat Password</label>
        <input id="repeat_password" class="form-control" type="password">
      </div>
    </form>

    <button class="btn btn-primary btn-submit">Register</button><br>

    <a href="/auth">Already registered</a>
  </main>
</template>
