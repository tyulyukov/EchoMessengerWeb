<template>
  <main class="auth-form">
    <img class="logo" src="/src/assets/echo.png">
    <h1>Welcome Back!</h1>
    <p class="note">Login to your account</p>
    <form>
      <div class="input-group">
        <label>Username</label>
        <input id="username" class="form-control" type="text" autocomplete="false">
      </div>

      <div class="input-group">
        <label>Password</label>
        <input id="password" class="form-control" type="password">
      </div>
    </form>

    <button class="btn btn-primary btn-submit">Login</button><br>

    <a href="/register">Create an account</a>
  </main>
</template>
