#include <SoftwareSerial.h>
#include <TinyGPSPlus.h>

#define DEFAULT_BITRATE 9600
#define GPS_TX D8
#define GPS_RX D7

TinyGPSPlus dataParser;
SoftwareSerial gpsDevice(GPS_RX, GPS_TX);

double GLOBAL_GPS_LAT, GLOBAL_GPS_LON;
char c;
    
void initGPS()
{
  gpsDevice.begin(DEFAULT_BITRATE);
}

void deinitGPS(){
  gpsDevice.end();
}

void getLocationData()
{
  while (gpsDevice.available())
  {
    c = gpsDevice.read();
    if (dataParser.encode(c)){
      GLOBAL_GPS_LAT = dataParser.location.lat();
      GLOBAL_GPS_LON = dataParser.location.lng();
    }
  }
}
