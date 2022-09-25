# Created by: Seb Blair
# Date Created: 26-09-2022
# Verison:  1.0

# this script is designed to gather system statistics
AUTHOR="Seb Blair"
VERSION="1.0"
RELEASED="2022-09-16"

# Display help message
USAGE(){
         echo -e  $1
         echo -e "\nUsage: systemStats [-t temperature] [-f arm frequency] [-c cores] [-V volts]"
         echo -e "\t\t   [-m arm memory] [-M gpu memory] [-f free memory] [-i ipv4 and ipv6 address] "
         echo -e "\t\t   [-v version]"
         echo -e "\t\t   more information see: man systemStats"
}

# Check for arguments (error checking)

if [ $# -lt 1 ];then
        USAGE "Not enough arguments"
        exit 1
elif [ $# -gt 8 ]; then
        USAGE "Too many arguments supplied"
        exit 1
elif [[ ( $1 == '--help' ) || ( $1 == '-h' ) ]];then
        USAGE 'Help'
        exit 1
fi

# Frequently a script is written so that arguments can be passed in any order  using flags.
# With the flags method, some of the arguments can be made optional
# a:b means that a mandatory b is not. abc means they all optional

while getopts tfcVmMFiv OPTION
do
case ${OPTION}
in
t) TEMP=$(vcgencmd measure_temp)
   echo ${TEMP};;
f) ARMCLOCK=$(vcgencmd measure_clock arm )
   echo ${ARMCLCOCK};;
c) CORES=$(cat /sys/devices/system/cpu/present)
   echo "cores="${CORES};;
V) VOLT=$(vcgencmd measure_volts core)
   echo ${VOLT};;
m) ARMMEM=$(vcgencmd get_mem arm)
   echo ${ARMMEM};;
M) GPUMEM=$(vcgencmd get_mem gpu)
   echo ${GPUMEM};;
F) FREEMEM=$(free -m )
   echo ${FREEMEM};;
i) IP=$(hostname -I)
   echo "IP="${IP};;
v) echo -e "systemStats:\n\t   Version: ${VERSION}  Released: ${RELEASED} Author: ${AUTHOR}";;
*) USAGE "\n${*} argument was not recognised";;
esac
done
# end of script
