import { LightningElement } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets';
export default class AlarmClockApp extends LightningElement {
    clockImage=AlarmClockAssets+'/alarm-clock.png';
    ringtone=new Audio(AlarmClockAssets+'/ringtone-alarm.mp3');
    currentTime='';
    hours=[];
    minutes=[];
    alarmTime
    meridians=["AM","PM"];
    hoursSelected='';
    meridianSelected='';
    minutesSelected='';
    isAlarmSet=false;
//connectedCallBack is a lifeCycle hook,which will call as soon as componenet get loads
connectedCallback(){
this.currentTimeHandler(); //we need to to fetch realTime data as soon as component get loads so we are calling it in connectedCallback
this.createHoursOptions();
this.createMinutesOptions();
} 
currentTimeHandler(){
    // setInterval(()=>{},1000);thia ia js method ,it will run method specific interval of time,
    // here 1000ms i.e. it will run after evey 1 second and method will be pass in curly braces
    setInterval(()=>{
let dateTime=new Date();
    let hour=dateTime.getHours();
    let minute=dateTime.getMinutes();
    let second=dateTime.getSeconds();
    let ampm='AM';
    if(hour==0){ 
        hour=12;
    }else if(hour==12){
        ampm="PM"
    }
    else if(hour>=12){
        hour=hour-12;
        ampm="PM";

    }
    hour=hour<10?"0"+hour:hour;
    minute=minute<10?"0"+minute:minute;
    second=second<10?"0"+second:second;

    this.currentTime=`${hour}:${minute}:${second}:${ampm}`;
    if(this.alarmTime===`${hour}:${minute} ${ampm}`){
        console.log("Alarm Triggered!!!!")
        this.ringtone.play();
        this.ringtone.loop= true;

    }
    },1000);
    

}

    createHoursOptions(){
        for(let i=1;i<=12;i++){
            let val=i<10?"0"+i:i;
            this.hours.push(val);
        }

    }
    createMinutesOptions(){
        for(let i=0;i<=59;i++){
            let val=i<10?"0"+i:i;
            this.minutes.push(val);
        }

    }

    optionhandler(event){
        //console.log("event.detail", event.detail);
        const {label,value}=event.detail
        if(label==="Hours"){
            this.hoursSelected=value

        }else if(label==="Minutes"){
            this.minutesSelected=value
        }else if(label==="AM-PM"){
            this.meridianSelected=value
        }else{}
       // To check if values are correctly passed from child to parent
/*console.log("this.meridianSelected:", this.meridianSelected);
console.log("this.hoursSelected:", this.hoursSelected);
console.log("this.minutesSelected:", this.minutesSelected);
*/


    }
    get isFieldNotSelected(){
        return !(this.hoursSelected && this.minutesSelected && this.meridianSelected)
    }
    setAlarmHandler(){
        this.alarmTime=`${this.hoursSelected}:${this.minutesSelected} ${this.meridianSelected}`
        this.isAlarmSet=true;
    }
    clearAlarmHandler(){
        this.alarmTime='';
        this.isAlarmSet=false;
        this.ringtone.pause();
        //to reset the value of options,by using @api method and query selector concept,defined in child component,
        // and called from here
        const elements=this.template.querySelectorAll('c-clock-drop-down');
        Array.from(elements).forEach(element=>{
            element.reset("")
        })
    }
    
}