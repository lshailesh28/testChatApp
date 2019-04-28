import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../chat';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  chat: Chat;
  lastSynced: Number = null;

  allChats: Chat[] = [];
  timerID;

  constructor( private route: ActivatedRoute, private http: HttpClient, public messageService: MessageService) { }

  ngOnInit() {
    console.log(
      "userName " + this.route.snapshot.queryParamMap.get("userName")
    );
    this.loadAllChats(true);

    this.timerID = setInterval(() => {
      console.log("Timer");
      this.loadAllChats(false);
    }, 1000);

    this.chat = {
      userID: this.route.snapshot.queryParamMap.get("_id"),
      userName: this.route.snapshot.queryParamMap.get("userName"),
      msg: "",
      crAt: null
    };
  }

  loadAllChats(isFirstTime: boolean): void {
    this.http
      .get("http://localhost:3000/api/get_chats/" + this.lastSynced)
      .subscribe(
        data => {
          console.log("chats loaded  successfully ");

          var newMsgCount = 0;
          for (var key in data) {
            console.log("forrr " + key);
            ++newMsgCount;
            if (isFirstTime) this.allChats.push(data[key]);
            else this.allChats.unshift(data[key]);
          }

          //to set last synced date

          this.lastSynced = new Date().getTime();
          //show new message
          this.messageService.showMessage(newMsgCount);
          console.log(this.allChats);
        },
        error => {
          console.log("Error", error);
        }
      );
  }

}
