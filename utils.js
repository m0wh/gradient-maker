module.exports = {
  konsole: {
    error: message => console.log,
    log: message => {
      const date = new Date();
      const hourStr = date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
      console.log(`${ hourStr } - ${ message }`);
    }
  }
}