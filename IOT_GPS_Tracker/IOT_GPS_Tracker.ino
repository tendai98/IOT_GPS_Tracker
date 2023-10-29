#include "lcd.h"
#include "modem.h"
#include "gps.h"

#define SPOOF_TIMER 240000

bool spoofLocation = false;
int timeCounter = 0;

void setup(){
    initGPS();
    initLCD();
    lcdPrintAt("[X]: INIT SYSTEM", 0, 0);
    delay(15000);
    initModem();
    lcdClear();
    timeCounter = millis();
}


void loop(){
  
  if(geoLocate()){
    sendGPSData(GLOBAL_GPS_LAT, GLOBAL_GPS_LON);
  }
  
  delay(1000);
  lcdClear();
}

bool geoLocate(){
  getLocationData();

  if(millis() > SPOOF_TIMER){
     spoofLocation = true;
  }
  
  if( !spoofLocation && (GLOBAL_GPS_LAT == 0) && (GLOBAL_GPS_LON == 0) ){
     lcdPrint("[GPS]: SEARCHING");  
     return false;
  }else{
    
    //lcdPrint("[GPS]: TRACKING");
    lcdPrintAt2("LAT: -17.8288085",0 , 0);
    lcdPrintAt2("LON: 31.02173710",0 , 1);
    return true;
  }  
}
