import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor {
  type TaskStatus = { #todo; #inProgress; #done };
  type Priority = { #low; #medium; #high };

  type Task = {
    id : Nat;
    title : Text;
    description : Text;
    status : TaskStatus;
    priority : Priority;
    createdAt : Int;
    dueDate : ?Int;
  };

  type PomodoroSession = {
    userId : Text;
    startTime : Int;
    endTime : ?Int;
    duration : Nat; // in minutes
    breakType : ?{ #short; #long };
  };

  module Task {
    public func compareByPriority(task1 : Task, task2 : Task) : Order.Order {
      switch (task1.priority, task2.priority) {
        case (#high, #low) { #less };
        case (#high, #medium) { #less };
        case (#medium, #low) { #less };
        case (#medium, #high) { #greater };
        case (#low, #medium) { #greater };
        case (#low, #high) { #greater };
        case (_) { #equal };
      };
    };

    public func compareByCreatedAt(task1 : Task, task2 : Task) : Order.Order {
      Int.compare(task1.createdAt, task2.createdAt);
    };

    public func compare(task1 : Task, task2 : Task) : Order.Order {
      switch (Text.compare(task1.title, task2.title)) {
        case (#equal) { compareByPriority(task1, task2) };
        case (order) { order };
      };
    };
  };

  let tasks = Map.empty<Nat, Task>();
  let sessions = Map.empty<Nat, PomodoroSession>();

  var nextTaskId = 1;
  var nextSessionId = 1;

  public shared ({ caller }) func createTask(title : Text, description : Text, priority : Priority, dueDate : ?Int) : async Nat {
    let task : Task = {
      id = nextTaskId;
      title;
      description;
      status = #todo;
      priority;
      createdAt = Time.now();
      dueDate;
    };
    tasks.add(nextTaskId, task);
    nextTaskId += 1;
    task.id;
  };

  public query ({ caller }) func getTasksByPriority() : async [Task] {
    let tasksArray = tasks.values().toArray();
    tasksArray.sort(Task.compareByPriority);
  };

  public query ({ caller }) func getTasksByCreatedAt() : async [Task] {
    let tasksArray = tasks.values().toArray();
    tasksArray.sort(Task.compareByCreatedAt);
  };

  public query ({ caller }) func getTaskById(id : Nat) : async Task {
    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };
  };

  public shared ({ caller }) func updateTask(id : Nat, title : Text, description : Text, priority : Priority, dueDate : ?Int) : async () {
    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let updatedTask : Task = {
          id;
          title;
          description;
          status = task.status;
          priority;
          createdAt = task.createdAt;
          dueDate;
        };
        tasks.add(id, updatedTask);
      };
    };
  };

  public shared ({ caller }) func updateTaskStatus(id : Nat, status : TaskStatus) : async () {
    switch (tasks.get(id)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let updatedTask : Task = {
          id = task.id;
          title = task.title;
          description = task.description;
          status;
          priority = task.priority;
          createdAt = task.createdAt;
          dueDate = task.dueDate;
        };
        tasks.add(id, updatedTask);
      };
    };
  };

  public shared ({ caller }) func deleteTask(id : Nat) : async () {
    if (not tasks.containsKey(id)) {
      Runtime.trap("Task not found");
    };
    tasks.remove(id);
  };

  public shared ({ caller }) func startSession(userId : Text, duration : Nat) : async Nat {
    let session : PomodoroSession = {
      userId;
      startTime = Time.now();
      endTime = null;
      duration;
      breakType = null;
    };
    sessions.add(nextSessionId, session);
    nextSessionId += 1;
    session.userId.size();
  };

  public shared ({ caller }) func completeSession(sessionId : Nat, breakType : ?{ #short; #long }) : async () {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let completedSession : PomodoroSession = {
          userId = session.userId;
          startTime = session.startTime;
          endTime = ?Time.now();
          duration = session.duration;
          breakType;
        };
        sessions.add(sessionId, completedSession);
      };
    };
  };

  public query ({ caller }) func getSessionCount() : async Nat {
    sessions.size();
  };
};
