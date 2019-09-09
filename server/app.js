var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var walletRouter = require('./routes/wallet');

const models = require('./models/index.js');
const config = require('./config/config');

var app = express();

models.sequelize.sync().then(()=>{
  console.log("DB connection success!");
}).catch(err => {
  console.log("connection fail!");
  console.log(err);
});
// set port
app.set('port', process.env.PORT || 3000);

// set jwt-secret
app.set('jwt-secret', config.secret);

// set initial view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/wallet', walletRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), function(){
  console.log(`Server is running on ${app.get('port')}`);
});

module.exports = app;
