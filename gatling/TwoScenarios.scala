package ass

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class TwoScenarios extends Simulation {

	val httpProtocol = http
		.baseUrl("http://localhost:8080/")

	val headers_0 = Map(
		"Content-Type" -> "application/json")
	val headers_1 = Map(
		"Content-Type" -> "application/json",
		"actor_id" -> "63ed27e96f6eb8680cc0b163")
	val headers_2 = Map(
		"Content-Type" -> "application/json",
		"actor_id" -> "63ed27e96f6eb8680cc0b164")
	val headers_3 = Map(
		"Content-Type" -> "application/json",
		"actor_id" -> "63ed27e96f6eb8680cc0b165")

	//managerId = "63ed27e96f6eb8680cc0b163"
	//tripId = "63ed27e96f6eb8680cc0b162"

	object CreateManager {
		val createManager = exec(http("POST ACTOR-MANAGER")
			.post("v1/actors")
			.body(RawFileBody("/tmp/resources/actor-manager-post.json"))
			.headers(headers_0))
		.pause(1)
	}

	object ReadManager {
		val readManager = exec(http("GET ACTOR-MANAGER")
			.put("v1/actors/" + "63ed27e96f6eb8680cc0b163")
			.headers(headers_0))
		.pause(1)
	}

	object ModifyManager {
		val modifyManager = exec(http("PUT ACTOR-MANAGER")
			.put("v1/actors/" + "63ed27e96f6eb8680cc0b163")
			.body(RawFileBody("/tmp/resources/actor-manager-put.json"))
			.headers(headers_0))
		.pause(1)
	}

	object CreateTrip {
		val createTrip = exec(http("POST TRIP")
			.post("v1/trips")
			.body(RawFileBody("/tmp/resources/trip-post.json"))
			.headers(headers_1))
		.pause(1)
	}

	object ReadTrip {
		val readTrip = exec(http("GET TRIP")
			.get("v1/trips/" + "63ed27e96f6eb8680cc0b162")
			.headers(headers_0))
		.pause(1)
	}

	object UpdateTrip {
		val updateTrip = exec(http("PUT TRIP")
			.put("v1/trips/" + "63ed27e96f6eb8680cc0b162")
			.body(RawFileBody("/tmp/resources/trip-put.json"))
			.headers(headers_1))
		.pause(1)
	}

	object PublishTrip {
		val patchTrip = exec(http("PATCH TRIP PUBLISH")
			.patch("v1/trips/" + "63ed27e96f6eb8680cc0b162" + "/publish")
			.body(RawFileBody("/tmp/resources/trip-patch-publish.json"))
			.headers(headers_1))
		.pause(1)
	}

	object CreateExplorer1 {
		val createExplorer1 = exec(http("POST ACTOR-EXPLORER1")
			.post("v1/actors")
			.body(RawFileBody("/tmp/resources/actor-explorer1-post.json"))
			.headers(headers_0))
		.pause(2)
	}

	object CreateExplorer2 {
		val createExplorer2 = exec(http("POST ACTOR-EXPLORER2")
			.post("v1/actors")
			.body(RawFileBody("/tmp/resources/actor-explorer2-post.json"))
			.headers(headers_0))
		.pause(2)
	}

	object ReadActors {
		val readActors = exec(http("GET ACTORS")
			.get("v1/actors")
			.headers(headers_0))
		.pause(1)
	}

	object ReadTrips {
		val readTrips = exec(http("GET TRIPS")
			.get("v1/search")
			.headers(headers_0))
		.pause(3)
	}

	object CreateApplication1 {
		val createApplication1 = exec(http("POST APPLICATION1")
			.post("v1/applications")
			.body(RawFileBody("/tmp/resources/application1-post.json"))
			.headers(headers_2))
		.pause(1)
	}

	object ModifyApplication {
		val modifyApplication = exec(http("PATCH APPLICATION1")
			.patch("v1/applications/641611fe3df8aa942463e4c4/comments")
			.body(RawFileBody("/tmp/resources/application-comments-patch.json"))
			.headers(headers_2))
		.pause(1)
	}

	object CreateApplication2 {
		val createApplication2 = exec(http("POST APPLICATION2")
			.post("v1/applications")
			.body(RawFileBody("/tmp/resources/application2-post.json"))
			.headers(headers_3))
		.pause(1)
	}

	object ReadTripApplications {
		val readTripApplications = exec(http("GET TRIP APPLICATIONS")
			.get("v1/trips/63ed27e96f6eb8680cc0b162/applications")
			.headers(headers_1))
		.pause(1)
	}

	object AcceptApplication {
		val acceptApplication = exec(http("PATCH APPLICATION ACCEPT")
			.patch("v1/applications/641611fe3df8aa942463e4c4/accept")
			.headers(headers_1))
		.pause(1)
	}

	object RejectApplication {
		val rejectApplication = exec(http("PATCH APPLICATION REJECT")
			.patch("v1/applications/641612003df8aa942463e4d4/reject")
			.body(RawFileBody("/tmp/resources/application-reject-patch.json"))
			.headers(headers_1))
		.pause(1)
	}

	val tripCreationScn = scenario("Trip creation").exec(
		CreateManager.createManager,
		ReadManager.readManager,
		ModifyManager.modifyManager,
		ReadManager.readManager,
		CreateTrip.createTrip,
		ReadTrip.readTrip,
		UpdateTrip.updateTrip,
		PublishTrip.patchTrip
	)

	val applicationsCreationScn = scenario("Applications creation").exec(
		CreateExplorer1.createExplorer1,
		CreateExplorer2.createExplorer2,
		ReadActors.readActors,
		ReadTrips.readTrips,
		CreateApplication1.createApplication1,
		ModifyApplication.modifyApplication,
		CreateApplication2.createApplication2,
		ReadTripApplications.readTripApplications,
		AcceptApplication.acceptApplication,
		RejectApplication.rejectApplication
	)

	setUp(
		tripCreationScn.inject(atOnceUsers(1)),
		applicationsCreationScn.inject(atOnceUsers(1))
	).protocols(httpProtocol)
}
