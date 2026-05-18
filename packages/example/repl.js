// @ts-check
function readLine() {
  var buffer = '';
  while (true) {
    var eventHandle = efi.SystemTable.ConIn.WaitForKey();
    if (!eventHandle) {
      continue;
    }
    var which = efi.SystemTable.BootServices.WaitForEvent([eventHandle]);
    if (which === null) {
      continue;
    }
    var key = efi.SystemTable.ConIn.ReadKeyStroke();
    if (!key) {
      continue;
    }
    var ch = key.unicodeChar;
    if (ch === 10) {
      continue;
    }
    if (ch === 13) {
      println('');
      return buffer;
    }
    if (ch === 8) {
      if (buffer.length) {
        buffer = buffer.slice(0, -1);
        efi.SystemTable.ConOut.OutputString('\b \b');
      }
      continue;
    }
    if (ch >= 32 && ch <= 126) {
      var c = String.fromCharCode(ch);
      buffer += c;
      efi.SystemTable.ConOut.OutputString(c);
    }
  }
}

println('promethee repl: type JS and press Enter');
while (true) {
  print('> ');
  var line = readLine();
  if (!line.length) {
    continue;
  }
  try {
    // eslint-disable-next-line no-eval
    var result = eval(line);
    if (result !== undefined) {
      println(String(result));
    }
  } catch (err) {
    println('error: ' + err);
  }
}
