#! /usr/bin/env bash
# CREATED BY: Name
# Date created: todays
# Version 2
# this script is designed to gather system statistics
AUTHOR="Seb"
VERSION="0.2"
RELEASED="2022-02-09"
FILE=~/ACE/systemstats.log
# Display help message
USAGE(){
        echo -e $1
        echo -e "\nUsage: systemStats [-c cores] [-D diskspace] [-i ipv4 address]"
        echo -e "\t\t   [-u cpu usage] [-v version]"
        echo -e "\t\t   more information see man systemStats"
}
# check for arguments (error checking)
if [ $# -lt 1 ];then
        USAGE "Not enough arguments"
        exit 1
elif [ $# -gt 6 ];then
        USAGE "Too many argurmnets supplied"
        exit 1
elif [[ ( $1 == '-h' ) || ( $1 == '--help'  ) ]];then
        USAGE "Help!"
        exit 1
fi
# frequently a scripts are written so that arguments can b passed in any order using 'flags'
# With the flags method, some of the arguments can be made manadatory or optional
# a:b (a is mandatory, b is optional) abc is all optional
while getopts cDiuv OPTION
do
case ${OPTION}
in
c) CORES=$(cat /sys/devices/system/cpu/present)
   echo "Cores="${CORES};;
D) DISKSPACES=$(df -H  | grep -w 'overlay' | awk '{print "T: "$2 " U: "$3 " A: "$4}')
   echo -e "Disk Info="${DISKSPACES};;
i) IP=$(hostname -I)
   echo "Host IP="${IP};;
u)
   tmp=$(grep -w 'cpu' /proc/stat)
   USAGE=$(${tmp}| awk '{(usage=($2+$3+$4+$6+$7+$8)*100/($2+$3+$4+$5+$6+$7+$8))}
                                           {free=($5)*100/($2+$3+$4+$5+$6+$7+$8)}
                                            END {printf " Used CPU: %.2f%%",usage}
                                                {printf " Free CPU: %.2f%%",free}')
   echo -e ${USAGE};;
v) echo -e "systemStats:\n\t\tVersion: ${VERSION} Released: ${RELEASED} Author: ${AUTHOR}";;
*) USAGE "Option not recognised"
esac
done
