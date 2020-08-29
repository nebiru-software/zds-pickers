Updating the firmware is a somewhat technical topic. You must be comfortable using a terminal or command line before continuing.

<section>
<h3>For the faint of heart...</h3>
<div>
Third-party utilities do exist that may be easier for the non-technical user to use.
We cannot offer support if you choose to use these, however they are relatively straight-forward to use.
<ul>
  <li><a href="http://blog.zakkemble.co.uk/avrdudess-a-gui-for-avrdude/" target="_blank" rel="noopener noreferrer">AVRDUDESS</a></li>
  <li><a href="https://sourceforge.net/projects/avrdude-gui/" target="_blank" rel="noopener noreferrer">avrdude-gui</a></li>
  <li><a href="https://sourceforge.net/projects/bitburner/" target="_blank" rel="noopener noreferrer">BitBurner (Windows only)</a></li>
  <li><a href="http://arduinodev.com/arduino-uploader/" target="_blank" rel="noopener noreferrer">Arduino Builder (Windows only)</a></li>
</ul>
</div>
</section>

# Using AVRDUDE toolchain

AVRDUDE is the CLI used to upload the firmware to your ZDS Shifter Pro. Please follow the link below for your OS and step through the instructions. The remainder of this document assumes you have AVRDUDE installed.

- <a href="http://www.ladyada.net/learn/avr/setup-unix.html" target="_blank" rel="noopener noreferrer">Linux</a>
- <a href="http://www.ladyada.net/learn/avr/setup-mac.html" target="_blank" rel="noopener noreferrer">MacOS</a>
- <a href="http://www.ladyada.net/learn/avr/setup-win.html" target="_blank" rel="noopener noreferrer">Windows</a>

Here is a document describing <a href="http://www.ladyada.net/learn/avr/avrdude.html" target="_blank" rel="noopener noreferrer">AVRDUDE and its usage</a> should you get stuck.

# Preparing your ZDS Shifter Pro for update

With the unit powered down and disconnected, remove the four outer screws on the bottom of the unit and carefully open it.
Place it flat on a table near your computer and locate the small "reset" button on the outside corner of the main circuit board. We'll refer to this button in a bit.

Now connect the ZDS Shifter Pro to your computer via USB. Do not connect any other cables at this time.

#### MacOS

1. Open a terminal with your ZDS Shifter Pro connected via USB and navigate to the folder you've placed the `firmware.hex` file into (e.g. `~/Downloads`)
2. Type in this command but do not yet hit return.<br/>
   `ls /dev/tty.usb*`
3. "Double-click" the reset button on the green board, wait a second and then press return to execute the command. Your output will vary but should be something like "/dev/tty.usbmodem2421"
4. Enter in this command but again do not yet hit enter<br/>
   `avrdude -c avr109 -P /dev/tty.usbmodem2421 -p atmega32u4 -U flash:w:firmware.hex`
5. Replace the device name with the one your obtained in step 3
6. Once again "double-click" the reset button, wait a second and then press enter. The upload process should begin.

#### Linux

Use the same steps outlined for MacOS, however substitute `ls /dev/tty*.` for the `ls /dev/tty.usb*` command in step 2.

#### Windows

1. Copy the downloaded `firmware.hex` file into `C:\WinAVR-xxx\bin`. Alternatively you can add `C:\WinAVR-xxx\bin` to your path to be able to run the commands from any directory. <small>_( replace xxx with actual build number )_</small>
2. Launch a terminal and cd to the folder containing the `firmware.hex` file
3. With your ZDS Shifter Pro connected, launch <a href="https://www.mathworks.com/help/supportpkg/arduinoio/ug/find-arduino-port-on-windows-mac-and-linux.html?requestedDomain=www.mathworks.com" target="_blank" rel="noopener noreferrer">Device Manager</a>, expand Ports and determine which com port is being used by your unit.
4. "Double-click" the reset button on your ZDS Shifter Pro and watch Device Manager for any changes. You should see that the ZDS Shifter Pro is now using a different port number (for about 8 seconds)
5. Enter in this command but do not yet hit return<br/>
   `avrdude -c avr109 -P comX -p atmega32u4 -U flash:w:firmware.hex`
6. Replace `comX` with the one your obtained in step 4 (e.g. `com3`)
7. Once again "double-click" the reset button, wait a second and then press enter. The upload process should begin.

<hr/>

A successful update will resemble:

<pre>
Connecting to programmer: .
Found programmer: Id = "CATERIN"; type = S
    Software Version = 1.0; No Hardware Version given.
Programmer supports auto addr increment.
Programmer supports buffered memory access with buffersize=128 bytes.
<br>
Programmer supports the following devices:
    Device code: 0x44
<br>
avrdude: AVR device initialized and ready to accept instructions
<br>
Reading | ################################################## | 100% 0.01s
<br>
avrdude: Device signature = 0x1e9587
avrdude: NOTE: FLASH memory has been specified, an erase cycle will be performed
         To disable this feature, specify the -D option.
avrdude: erasing chip
avrdude: reading input file "firmware.hex"
avrdude: input file firmware.hex auto detected as Intel Hex
avrdude: writing flash (15806 bytes):
<br>
Writing | ################################################## | 100% 1.58s
<br>
<br>
avrdude: 15806 bytes of flash written
avrdude: verifying flash memory against firmware.hex:
avrdude: load data flash data from input file firmware.hex:
avrdude: input file firmware.hex auto detected as Intel Hex
avrdude: input file firmware.hex contains 15806 bytes
avrdude: reading on-chip flash data:
<br>
Reading | ################################################## | 100% 0.31s
<br>
<br>
avrdude: verifying ...
avrdude: 15806 bytes of flash verified
<br>
avrdude: safemode: Fuses OK
<br>
avrdude done.  Thank you.
</pre>

If all looks good, then congratulations! You've successfully updated your ZDS Shifter Pro. Carefully disconnect and reassemble it. The next time you power it up it will use the new firmware.

<a href="http://download.savannah.gnu.org/releases/avrdude/avrdude-doc-6.3.pdf" target="_blank" rel="noopener noreferrer">Complete, detailed documentation of AVRDUDE</a>
