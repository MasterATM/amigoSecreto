# Cycle-Based Matching

Each participant gives exactly one gift and receives exactly one gift. The matching is a single cycle covering all participants (a Hamiltonian cycle on the participant graph). No person gives to themselves. This model handles both even and odd participant counts without special cases. Implemented as: shuffle participants, form one cycle. One big loop — no reciprocal pairs, no cycle decomposition logic.
