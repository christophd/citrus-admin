import {Injectable} from "@angular/core";
import {parseBody, StompConnection, StompConnectionService} from "./stomp-connection.service";
import {SocketEvent} from "../model/socket.event";
import {TestResult} from "../model/tests";
import {log} from "../util/redux.util";

@Injectable()
export class LoggingService {
    private stomp:StompConnection;
    constructor(
       private stompConnection:StompConnectionService
    ) {
        this.stomp = stompConnection.getConnection('/api/logging')
    }

    private getConnectedTopicObservable(topic:string) {
        return this.stomp.connect().switchMap(c => c.subscribeToTopic(topic))
    }

    get testEvents() {
        return this.getConnectedTopicObservable('/topic/test-events').map(parseBody(SocketEvent))
    }

    get logOutput() {
        return this.getConnectedTopicObservable('/topic/log-output').map(parseBody(SocketEvent))
    }

    get messages() {
        return this.getConnectedTopicObservable('/topic/messages').map(parseBody())
    }

    get results() {
        return this.getConnectedTopicObservable('/topic/results').map(parseBody(TestResult))
    }
}