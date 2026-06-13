Mobile app layout defines two nested layouts:

- Main
- Climbing
    - Logbook
    - Browse
    - Stats
- Training

In the future it would make sense for training to have a similar nested layout as climbing. This bare the question then of if this is the best approach from a UX perspective. Additionally adding new sports, like diving, paddle, etc could be cumbersome. Since training refers to Gym/calisthenics like training it would make sense to rename it. Also, specially for climbing a map like browse with pins could be very useful.

I was thinking we could remove the nested layout it self, and instead add a mode swapper somewhere (header, side hamburger icon, or other nice place). Then the main layout elements could respond to this mode, all sharing the same home with a quick glance of what you have been doing lately (customizable dashboard?)

As of now I would like to support gym workouts, apnea training tables and padel tenis
