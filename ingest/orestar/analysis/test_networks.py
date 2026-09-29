"""Ensure efficient sampling retains the seeded stream and graph margins."""
import unittest
from collections import Counter
import numpy as np
from networks import random_pairs, swap

class NetworkTests(unittest.TestCase):
    def test_buffer_preserves_original_stream_across_boundaries(self):
        original=np.random.default_rng(20260927)
        buffered=random_pairs(np.random.default_rng(20260927),32107)
        for _ in range(8200):
            self.assertEqual(tuple(original.integers(32107,size=2)),tuple(next(buffered)))

    def test_swaps_preserve_degrees_without_duplicate_edges(self):
        original=[(d,c) for d in range(30) for c in range(5) if (d+c)%3==0]
        edges=original.copy();edge_set=set(edges)
        stream=random_pairs(np.random.default_rng(20260928),len(edges))
        swap(edges,edge_set,stream,len(edges)*10)
        self.assertEqual(len(edge_set),len(edges))
        self.assertEqual(set(edges),edge_set)
        for side in (0,1):
            self.assertEqual(Counter(e[side] for e in original),Counter(e[side] for e in edges))
        repeat=original.copy()
        swap(repeat,set(repeat),random_pairs(np.random.default_rng(20260928),len(repeat)),len(repeat)*10)
        self.assertEqual(edges,repeat)

if __name__=='__main__':unittest.main()
