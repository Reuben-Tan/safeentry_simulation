# Project description
Modelling and simulating how safeentry could have adverse effects on the infection rates in shopping malls

## Problem
With circuit breaker measuers, retail malls are forced to restrict their number of entrances to ensure all mall patrons have checked into the safeentry database. However, this has led to bottle neck at these entrances, which might be counter productive to the government’s efforts to maintain safe-distancing. Increase the number of safe entry points might take a toll on the resources of the safe distancing ambasaddors. Our project aims to find out how malls should optimise the number of entry points while working around the contraints to reduce the number of infections in a mall.

> Cost function: Number of infected
> Variables: number of safeentry points in a mall

# To-do
- [X] Add queueing system
- [X] Add time dynamic
- [ ] Add infection dynamics
- [ ] Style up html/css so it doesn't look like nuno's lol
- [ ] Add graphs and statistics
- [ ] Add variable parameters
- [ ] Model customers mall exploration habits (*is it essential?*)
- [ ] Adding multiple entrances (customers choose which is the shorter one)

# Research
##### Monitoring physical distancing for crowd management: Real-time trajectory and group analysis
Website: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0240963

* Mutual distance
* Exposure Time
* Compare before and after COVID19 behaviors
* Offenders
* Sample graphs of analysis which includes measures like pre-covid density, behaviour of families on working/non-working days. W and without restrictions etc
* Introduce the concept of Corona Event: Whereby the event when 2 people, not belonging to the same family, get closer than a threshold distance D
* Focus on contact times and mutual distances considering statistical observables as the radial distribution functions -> can be employed to quantify average exposure times
* Colour code for different groups of people (part of family group, offenders group)
* Unit of measurement for density 1 ped/ppl/m^2
* Radial cumulative distribution function (RCDF) characterizes the distribution of pairwise distances between particles
* Monte Carlo Simulation (randomly evolving simulation) - pick a set of randomly generated paths of a large sample (law of large numbers) that generates an accurate view

##### Agent-Based Modeling and Simulation of Emergency Evacuation Strategies
https://www.youtube.com/watch?v=6--5d5WYeZU

* Agent based model to study the behavior of an individual
* Jamming and Herding behaviors
* Must define how the agents are to queue or would they herd in a semi-circle
* Simulate the exit doors at different locations (Whether you put it in the edges of the shopping mall or do you put it in the corners. Will they have any effect on the herding effect?
* What is the effect if one of the doors have lower visibility compared to the other doors (less known and periodically ignored)
* Introduction of obstacles(might cause more jamming

# Resources
* [Person flaticon link](https://www.flaticon.com/free-icon/user_1077114?term=person&page=1&position=1)
* [Kenny's research](https://docs.google.com/document/d/11rHY3Rgq45yhccLuIj630wfZChR9RmL2GrleiEnf2hs/edit)

* Counterflow situations where agents will try to avoid collisions with oncoming agents
* [Social distancing Simulation Java](https://www.youtube.com/watch?v=0UdlEHjm-gU) 
* [Social Distancing Simulation 2 in closed space](https://www.youtube.com/watch?v=ZB6jajr7an0)
* Can also explore the idea of controlled spaces in different rooms and compare it with no restrictions


