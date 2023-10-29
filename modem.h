#include <SoftwareSerial.h>

const char * AT_ECHO = "ATE1";
const char * AT_CFUN = "AT+CFUN=1";
const char * AT_CSTT = "AT+CSTT=\"econet.net\"";
const char * AT_CIPSPRT = "AT+CIPSPRT=0";
const char * AT_CIICR = "AT+CIICR";
const char * AT_CIFSR = "AT+CIFSR";

const char * AT_CIPSTART = "AT+CIPSTART=\"TCP\",\"165.22.182.128\",\"9331\"";
const char * AT_CIPSEND = "AT+CIPSEND";
const char * AT_CIPCLOSE = "AT+CIPCLOSE";

#define GSM_TX D5
#define GSM_RX D6
#define CTRL_Z 0x1A

SoftwareSerial modemSerial(GSM_RX, GSM_TX);

void sendCommand(const char * cmd, int trials){
  
  for(int i=0; i<trials; i++){
    modemSerial.println(cmd);
    delay(100);
    while(modemSerial.available()){
      char c = modemSerial.read();
      Serial.print(c);
      modemSerial.flush();
    }
    delay(50);
  }
  delay(1000);
}


void initModem() {
  Serial.begin(9600);
  modemSerial.begin(9600);

  lcdPrintAt("[GSM]: ECHO CTRL", 0, 1);
  sendCommand(AT_ECHO, 2);

  lcdPrintAt("[+] CONFIG MODEM", 0, 1);
  sendCommand(AT_CFUN, 2);
  sendCommand(AT_CIPSPRT, 2);

  lcdPrintAt("[APN]:econet.net", 0, 1);
  sendCommand(AT_CSTT, 2);
  delay(1000);
  
  lcdPrintAt("[+] GPRS=[ON]", 0, 1);
  sendCommand(AT_CIICR, 2);
  delay(2000);
  sendCommand(AT_CIFSR, 2);
}

void sendGPSData(double latitude, double longitude){
  sendCommand(AT_CIPSTART, 1);
  delay(5000);
  sendCommand(AT_CIPSEND, 1);
  modemSerial.printf("%f,%f",latitude, longitude);
  delay(100);
  modemSerial.write(CTRL_Z);
  sendCommand(AT_CIPCLOSE, 1);
}
