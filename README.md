# BeeBrilliant

BeeBrilliant is a prototype of an educational quiz web application. Users can take and create (create is currently only available via Postman or similar) customized quizzes on various subjects. Upon completion of a quiz, users receive instant feedback on their performance, including their score and any correct/incorrect answers. The app maintains a record of users' quiz history, enabling them to track their progress over time and identify areas for improvement. Users are rewarded with icon badges for reaching milestones, achieving high scores etc. and can view their progress\results on the user dashboard.

**This app has been deployed to Azure** and can be run locally on any dev environment that has the necessary prerequisites (.NET Core 7 etc. see below). By default I shut down the app services on Azure to save $ :-)

![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1709997567/home_page_svtj9m.png)

# Architecture
![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710002005/Bee_Brilliant_App_Architecture_l8uxto.png)
The app consists of an Angular 16 front end using Material UI components. Backend is a .NET Core 7 with Entity framework. I wanted to experiment and learn a few things so I designed this app to use 3 microservices (each with their own database), .NET Identity, Azure Service Bus and SignalR. 

I'm currently experimenting with Azure API Gateway to create a gateway in the future.

 - Angular 16
 - .NET Core 7
 - Entity Framework
 - Azure Service Bus
 - SignalR/Azure Signal R
 - .NET Identity
 - Azure APIM(in progress)


## *APIs*
APIs use JWT Bearer token authorization. 

![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710006794/Authentication_rz2vxp.png)

All APIs tested with postman scripts to minimize regressions during development.

 - Quiz\Question
 CRUD operations for questions\quizzes. Currently there are 2 question types (Fill-In and Multiple choice) but plan to add at least one more type (drag drop ordering). Currently the only wy to create new quizzes\questions is via the API but I hope to enable the feature in the UI soon
 - Results 
 CRUD Operations for Results\Awards
 - User\Account 
 CRUD operations for Registration and User Management

### Error Handling in APIs

All APIs use an ExceptionMiddleware class to catch and handle exceptions in one place rather than clutter up the individual controllers with try/catch blocks.

To do this you create your class and then wire it up in your Program.cs class using:

```app.UseMiddleware<ExceptionMiddleware>();```

Ordering is important for this - I put it right at the beginning of the request pipeline

## *Azure Service Bus and SignalR*

Once a user completes a quiz, the results are saved by the Reporting Service to the database and a message is put on a service bus queue. The message contains a ResultSummary object. A background service contains a Message Bus consumer that listens for messages on the queue. Once a message is received, the service will do some other potentially time-consuming summarizing activities like determining if the new result is a high score for the quiz or quiz category and level, determining if the user has earned a new reward etc.

If a user has earned a new award, SignalR is used to send a message to that user and to send the new award so the UI can be updated in real time.

This functionality works both locally and in the Azure deployment.

In the future, I'd like to play around with Azure functions by adding another message to the queue that will be processed by an Azure function to send an email to the user notifying them of their award as well.

# Current Features

**Quiz Page** - Users click on a card to take a quiz. Quizzes can be filtered by Category and Level. Results are paged and user can choose how many results to display per page.
![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710006908/quiz_page_czav8g.png)

**Quiz Questions** - Currently two question types can be included in a quiz. Fill In or Multiple Choice.
![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710006907/spelling_question_ux4l31.png)

![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710006906/multiple_choice_mr0hvp.png)

**Quiz Results** - Users can choose to view and save their results at the end of the quiz.

![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710006906/view_results_jzhk6w.png)

**All Results -** Users can view all their results in a paged list on their home page. They can choose the blue icon to review the result of the quiz or the pink one to retake the quiz.
![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710006905/home_results_panel_epsnvk.png)

**Awards** - When a user achieves 5 perfect scores in a Category/Level (e.g. Spelling/K-1) they earn a bronze award. Silver for 15 perfect scores, and Gold for 30. The user receives a real-time message when they get an award and the awards appear in the Trophy case on the Home page. 
![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710006904/signalRNotification_npyfsv.png)

![enter image description here](https://res.cloudinary.com/dngjhgdql/image/upload/v1710007715/Screen_Shot_2024-03-09_at_1.08.12_PM_ciplb3.png)




