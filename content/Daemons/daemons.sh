# Created By: Seb Blair
# Date Created: 2022-09-30

# This is a template of a bash daemon. To use for yourself, just set the
# DAEMONNAME variable and then enter in the commands to run in the doCommands
# function. Modify the variables just below to fit your preference.

DAEMONNAME="MY-DAEMON"

MYPID=$$
PIDDIR="."
PIDFILE="${PIDDIR}/${DAEMONNAME}.pid"

LOGDIR="."
# To use a dated log file.
# LOGFILE="${LOGDIR}/${DAEMONNAME}-$(date +"%Y-%m-%d").log"
# To use a regular log file.
LOGFILE="${LOGDIR}/${DAEMONNAME}.log"

# Log maxsize in KB
LOGMAXSIZE=1024   # 1mb

RUNINTERVAL=60 # In seconds

doCommands() {
  # This is where you put all the commands for the daemon.
  echo "Running commands."
}

################################################################################
# Below is the template functionality of the daemon.
################################################################################


setupDaemon() {
  # Make sure that the directories work.
  if [[ ! -d "${PIDDIR}" ]]; then
    mkdir "${PIDDIR}"
  fi
  if [[ ! -d "${LOGDIR}" ]]; then
    mkdir "${LOGDIR}"
  fi
  if [[ ! -f "${LOGFILE}" ]]; then
    touch "${LOGFILE}"
  else
    # Check to see if we need to rotate the logs.
    size=$(( $(stat --printf="%s" "${LOGFILE}") / 1024 ))
    if [[ $size -gt ${LOGMAXSIZE} ]]; then
      mv ${LOGFILE} "${LOGFILE}.$(date +%Y-%m-%dT%H-%M-%S).old"
      touch "${LOGFILE}"
    fi
  fi
}

startDaemon() {
  # Start the daemon.
  setupDaemon # Make sure the directories are there.
  if ! checkDaemon; then
    echo 1>&2 " * Error: ${DAEMONNAME} is already running."
    exit 1
  fi
  echo " * Starting ${DAEMONNAME} with PID: ${MYPID}."
  echo "${MYPID}" > "${PIDFILE}"
  log '*** '$(date +"%Y-%m-%d")": Starting up ${DAEMONNAME}."

  # Start the loop.
  loop
}

stopDaemon() {
  # Stop the daemon.
  if checkDaemon; then
    echo 1>&2 " * Error: ${DAEMONNAME} is not running."
    exit 1
  fi
  echo " * Stopping ${DAEMONNAME}"

  if [[ ! -z $(cat "${PIDFILE}") ]]; then
    kill -9 $(cat "${PIDFILE}") &> /dev/null
    log '*** '$(date +"%Y-%m-%d")": ${DAEMONNAME} stopped."
  else
    echo 1>&2 "Cannot find PID of running daemon"
  fi
}

statusDaemon() {
  # Query and return whether the daemon is running.
  if ! checkDaemon; then
    echo " * ${DAEMONNAME} is running."
  else
    echo " * ${DAEMONNAME} isn't running."
  fi
  exit 0
}

restartDaemon() {
  # Restart the daemon.
  if checkDaemon; then
    # Can't restart it if it isn't running.
    echo "${DAEMONNAME} isn't running."
    exit 1
  fi
  stopDaemon
  startDaemon
}

checkDaemon() {
  # Check to see if the daemon is running.
  # This is a different function than statusDaemon
  # so that we can use it other functions.
  if [[ -z "${OLDPID}" ]]; then
    return 0
  elif ps -ef | grep "${OLDPID}" | grep -v grep &> /dev/null ; then
    if [[ -f "${PIDFILE}" && $(cat "${PIDFILE}") -eq ${OLDPID} ]]; then
      # Daemon is running.
      return 1
    else
      # Daemon isn't running.
      return 0
    fi
  elif ps -ef | grep "${DAEMONNAME}" | grep -v grep | grep -v "${MYPID}" | grep -v "0:00.00" | grep bash &> /dev/null ; then
    # Daemon is running but without the correct PID. Restart it.
    log '*** '$(date +"%Y-%m-%d")": ${DAEMONNAME} running with invalid PID; restarting."
    restartDaemon
    return 1
  else
    # Daemon not running.
    return 0
  fi
  return 1
}

loop() {
  while true; do
    # This is the loop.
    NOW=$(date +%s)

    if [[ -z $${LAST} ]]; then
      LAST=$(date +%s)
    fi

    # Do everything you need the daemon to do.
    doCommands

    # Check to see how long we actually need to sleep for. If we want this to run
    # once a minute and it's taken more than a minute, then we should just run it
    # anyway.
    ${LAST}=$(date +%s)

    # Set the sleep interval
    if [[ ! $((${NOW}-${LAST}+${RUNINTERVAL}+1)) -lt $((${RUNINTERVAL})) ]]; then
      sleep $((${NOW}-${LAST}+${RUNINTERVAL}))
    fi
  done
}

log() {
  # Generic log function.
  echo "$1" >> "${LOGFILE}"
}


################################################################################
# Parse the command.
################################################################################

if [[ -f "${PIDFILE}" ]]; then
  OLDPID=$(cat "${PIDFILE}")
fi
checkDaemon
case "$1" in
  start)
    startDaemon
    ;;
  stop)
    stopDaemon
    ;;
  status)
    statusDaemon
    ;;
  restart)
    restartDaemon
    ;;
  *)
  echo 1>&2 " * Error: usage $0 { start | stop | restart | status }"
  exit 1
esac

exit 0
