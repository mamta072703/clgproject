import { Problem, ExperienceLevel, Difficulty } from '../src/types';

const baseProblems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    level: 'Beginner',
    difficulty: 'Easy',
    category: 'Data Structures',
    tag: 'Arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    boilerplate: {
      'JavaScript': `function twoSum(nums, target) {
    // Write your code here
    
}`,
      'Python': `def two_sum(nums, target):
    # Write your code here
    pass`,
      'Java': `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      'C++': `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
}`
    },
    tests: [
      { input: '[2,7,11,15]\n9', expected: '[0,1]' },
      { input: '[3,2,4]\n6', expected: '[1,2]' },
      { input: '[3,3]\n6', expected: '[0,1]' }
    ],
    coinsReward: 10,
    xpReward: 50,
    hints: [
      'A brute force approach would search all pairs. Can you do it in O(n) using a hash map?',
      'Store each number index in a dictionary. For any index i, look up if (target - num) exists in your map.'
    ],
    editorial: `### Two Sum - Editorial

The optimal approach is to use a Hash Map (or Object in JavaScript / Dictionary in Python) to keep track of the indices of the values we have already traversed.

By doing this, we can solve the problem in a single pass of the array.

#### Algorithm:
1. Initialize an empty hash map.
2. For each number \`nums[i]\` at index \`i\`:
   - Calculate its complement: \`complement = target - nums[i]\`.
   - Check if \`complement\` is present in the hash map.
   - If present, return the array of indices: \`[map.get(complement), i]\`.
   - Otherwise, store the key-value pair \`(nums[i], i)\` in the hash map.
3. If no match is found, return an empty array.

#### Complexity:
- **Time Complexity**: **O(N)** since we traverse the list of size N exactly once. Hash map lookups are O(1).
- **Space Complexity**: **O(N)** for storing up to N elements into the hash map.`
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    level: 'Beginner',
    difficulty: 'Easy',
    category: 'Programming Basics',
    tag: 'Strings',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with \`O(1)\` extra memory.`,
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    boilerplate: {
      'JavaScript': `function reverseString(s) {
    // Write your code here (modify 's' in-place)
    
}`,
      'Python': `def reverse_string(s):
    # Write your code here (modify 's' in-place)
    pass`,
      'Java': `class Solution {
    public void reverseString(char[] s) {
        // Write your code here
    }
}`,
      'C++': `class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your code here
    }
}`
    },
    tests: [
      { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' }
    ],
    coinsReward: 10,
    xpReward: 50,
    hints: [
      'Use a two-pointer approach.',
      'One pointer starts at index 0 and another starts at the end. Swap values and walk towards each other.'
    ],
    editorial: `### Reverse String - Editorial

This helper operation takes \`O(1)\` space since we only assign temporarily.

#### Algorithm:
1. Initialize a left pointer at \`0\` and a right pointer at the length of array minus 1.
2. While the left pointer is less than the right pointer:
   - Swap \`s[left]\` with \`s[right]\`.
   - Increment \`left\`.
   - Decrement \`right\`.

#### Complexity:
- **Time Complexity**: **O(N)** to perform N/2 swaps.
- **Space Complexity**: **O(1)** auxilliary memory.`
  },
  {
    id: 'fibonacci-number',
    title: 'Fibonacci Number',
    level: 'Beginner',
    difficulty: 'Easy',
    category: 'Algorithms',
    tag: 'Recursion',
    description: `The **Fibonacci numbers**, commonly denoted \`F(n)\` form a sequence, called the **Fibonacci sequence**, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is:

\`F(0) = 0, F(1) = 1\`
\`F(n) = F(n - 1) + F(n - 2), for n > 1.\`

Given \`n\`, calculate \`F(n)\`.`,
    constraints: [
      '0 <= n <= 30'
    ],
    examples: [
      {
        input: 'n = 2',
        output: '1',
        explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.'
      },
      {
        input: 'n = 4',
        output: '3',
        explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.'
      }
    ],
    boilerplate: {
      'JavaScript': `function fib(n) {
    // Write your code here
    
}`,
      'Python': `def fib(n):
    # Write your code here
    pass`,
      'Java': `class Solution {
    public int fib(int n) {
        // Write your code here
        return 0;
    }
}`,
      'C++': `class Solution {
public:
    int fib(int n) {
        // Write your code here
        return 0;
    }
}`
    },
    tests: [
      { input: '2', expected: '1' },
      { input: '4', expected: '3' },
      { input: '0', expected: '0' },
      { input: '8', expected: '21' }
    ],
    coinsReward: 10,
    xpReward: 50,
    hints: [
      'You can solve this with simple recursion, but memoization or iteration avoids duplicate calculations.',
      'An iterative bottom-up array approach uses O(n) time and O(n) space, which can be optimized to O(1) space.'
    ],
    editorial: `### Fibonacci Number - Editorial

While standard recursion is natural, it takes **O(2^N)** time. We can achieve **O(N)** optimized iterative time easily.

#### Optimal Iterative Algorithm:
1. If \`n <= 1\`, return \`n\`.
2. Keep two variables: \`prev2 = 0\` and \`prev1 = 1\`.
3. Loop from 2 to \`n\`:
   - \`current = prev1 + prev2\`
   - \`prev2 = prev1\`
   - \`prev1 = current\`
4. Return \`prev1\`.

#### Complexity:
- **Time Complexity**: **O(N)**.
- **Space Complexity**: **O(1)** since we only store variables.`
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    level: 'Intermediate',
    difficulty: 'Easy',
    category: 'Data Structures',
    tag: 'Stack',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \`()[]{}\`.'
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    boilerplate: {
      'JavaScript': `function isValid(s) {
    // Write your code here
    
}`,
      'Python': `def is_valid(s):
    # Write your code here
    pass`,
      'Java': `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        return false;
    }
}`,
      'C++': `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        return false;
    }
}`
    },
    tests: [
      { input: '"()"', expected: 'true' },
      { input: '"()[]{}"', expected: 'true' },
      { input: '"(]"', expected: 'false' },
      { input: '"([)]"', expected: 'false' },
      { input: '"{[]}"', expected: 'true' }
    ],
    coinsReward: 10,
    xpReward: 50,
    hints: [
      'Use a Stack data structure.',
      'Push opening brackets onto the stack. When seeing a closing bracket, check if it matches the top of the stack.'
    ],
    editorial: `### Valid Parentheses - Editorial

The stack is a LIFO (Last-In, First-Out) structure, which is ideal for matching nesting elements.

#### Algorithm:
1. Initialize an empty stack.
2. Create a dictionary mapping closing brackets to opening brackets: \`{')': '(', '}': '{', ']': '['}\`.
3. Iterate through each character \`char\` in \`s\`:
   - If \`char\` is a closing bracket:
     - Pop the top element from the stack (using a placeholder if the stack is empty).
     - If the popped element does not match the mapped opening bracket, return \`false\`.
   - Else, push the opening bracket to the stack.
4. If the stack is empty at the end, return \`true\`, otherwise \`false\`.

#### Complexity:
- **Time Complexity**: **O(N)** where N is the length of string \`s\`.
- **Space Complexity**: **O(N)** for placing elements in the stack in the worst-case.`
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    level: 'Intermediate',
    difficulty: 'Medium',
    category: 'Algorithms',
    tag: 'Dynamic Programming',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: [
      '1 <= n <= 45'
    ],
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top:\\n1. 1 step + 1 step\\n2. 2 steps'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways to climb to the top:\\n1. 1 step + 1 step + 1 step\\n2. 1 step + 2 steps\\n3. 2 steps + 1 step'
      }
    ],
    boilerplate: {
      'JavaScript': `function climbStairs(n) {
    // Write your code here
    
}`,
      'Python': `def climb_stairs(n):
    # Write your code here
    pass`,
      'Java': `class Solution {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`,
      'C++': `class Solution {
public:
    int climbStairs(int n) {
        // Write your code here
        return 0;
    }
}`
    },
    tests: [
      { input: '2', expected: '2' },
      { input: '3', expected: '3' },
      { input: '5', expected: '8' }
    ],
    coinsReward: 20,
    xpReward: 100,
    hints: [
      'To reach step i, you can either step from step (i-1) or step (i-2).',
      'This means the number of ways to reach step i is equal to ways(i-1) + ways(i-2), which is the Fibonacci sequence relations.'
    ],
    editorial: `### Climbing Stairs - Editorial

This is a classic introductory Dynamic Programming problem.

#### Equation:
\`dp[i] = dp[i-1] + dp[i-2]\`

#### Complexity:
- **Time Complexity**: **O(N)**.
- **Space Complexity**: **O(1)** when using state optimization.`
  },
  {
    id: 'linked-list-cycle',
    title: 'Linked List Cycle',
    level: 'Intermediate',
    difficulty: 'Medium',
    category: 'Data Structures',
    tag: 'Linked List',
    description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer. Internally, \`pos\` is used to denote the index of the node that tail's \`next\` pointer is connected to. **Note that \`pos\` is not passed as a parameter**.

Return \`true\` *if there is a cycle in the linked list*. Otherwise, return \`false\`.`,
    constraints: [
      'The number of nodes in the list is in the range [0, 10^4].',
      '-10^5 <= Node.val <= -10^5'
    ],
    examples: [
      {
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where tail connects to the second node.'
      }
    ],
    boilerplate: {
      'JavaScript': `/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
function hasCycle(head) {
    // Write your code here
    
}`,
      'Python': `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

def has_cycle(head):
    # Write your code here
    pass`,
      'Java': `/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        // Write your code here
        return false;
    }
}`,
      'C++': `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    bool hasCycle(ListNode *head) {
        // Write your code here
        return false;
    }
}`
    },
    tests: [
      { input: '[3,2,0,-4]\n1', expected: 'true' },
      { input: '[1]\n-1', expected: 'false' }
    ],
    coinsReward: 20,
    xpReward: 100,
    hints: [
      'Can you solve this in O(1) auxiliary space?',
      "Use Floyd's Cycle Finding algorithm, also known as the Tortoise and Hare approach. Move one pointer twice as fast."
    ],
    editorial: `### Linked List Cycle - Editorial

#### Floyd's Tortoise and Hare Algorithm:
We establish two pointers:
- **Slow Pointer** moving 1 step at a time.
- **Fast Pointer** moving 2 steps at a time.

If there is a cycle, the Fast pointer will eventually catch up and meet the Slow pointer. If there is no cycle, the Fast pointer will hit the end (\`null\`).

#### Complexity:
- **Time Complexity**: **O(N)**.
- **Space Complexity**: **O(1)** auxiliary space.`
  },
  {
    id: 'edit-distance',
    title: 'Edit Distance',
    level: 'Advanced',
    difficulty: 'Hard',
    category: 'Algorithms',
    tag: 'Dynamic Programming',
    description: `Given two strings \`word1\` and \`word2\`, return *the minimum number of operations required to convert \`word1\` to \`word2\`*.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character`,
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.'
    ],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse (replace "h" with "r")\nrorse -> rose (delete "r")\nrose -> ros (delete "e")'
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: '5',
        explanation: 'intention -> entention (replace "i" with "e")\nentention -> exention (replace "t" with "x")\nexention -> exection (replace "n" with "c")\nexection -> execution (replace "c" with "u")\nexecution -> execution (insert "i")'
      }
    ],
    boilerplate: {
      'JavaScript': `function minDistance(word1, word2) {
    // Write your code here
    
}`,
      'Python': `def min_distance(word1, word2):
    # Write your code here
    pass`,
      'Java': `class Solution {
    public int minDistance(String word1, String word2) {
        // Write your code here
        return 0;
    }
}`,
      'C++': `class Solution {
public:
    int minDistance(string word1, string word2) {
        // Write your code here
        return 0;
    }
}`
    },
    tests: [
      { input: '"horse"\n"ros"', expected: '3' },
      { input: '"intention"\n"execution"', expected: '5' }
    ],
    coinsReward: 40,
    xpReward: 200,
    hints: [
      'Use a 2D array of size (M+1) x (N+1) where M and N are the lengths of the two words.',
      'dp[i][j] represents the edit distance between prefixes word1[0...i-1] and word2[0...j-1].'
    ],
    editorial: `### Edit Distance - Editorial

This uses a classic 2D Dynamic Programming matrix.

#### Recursive Relation:
If \`word1[i-1] == word2[j-1]\`:
\`dp[i][j] = dp[i-1][j-1]\` (no action needed)

Else:
\`dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\`
representing Delete, Insert, and Replace respectively.

#### Complexity:
- **Time Complexity**: **O(M * N)**.
- **Space Complexity**: **O(M * N)**, which can be optimized to **O(min(M, N))** if only storing preceding rows.`
  },
  {
    id: 'n-queens',
    title: 'N-Queens',
    level: 'Advanced',
    difficulty: 'Hard',
    category: 'Algorithms',
    tag: 'Backtracking',
    description: `The **n-queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other.

Given an integer \`n\`, return *all distinct solutions to the **n-queens puzzle***. You may return the answer in **any order**.

Each solution contains a distinct board configuration of the n-queens' placement, where \`'Q'\` and \`'.'\` both indicate a queen and an empty space, respectively.`,
    constraints: [
      '1 <= n <= 9'
    ],
    examples: [
      {
        input: 'n = 4',
        output: '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]',
        explanation: 'There exist two distinct solutions for 4-queens board as shown.'
      }
    ],
    boilerplate: {
      'JavaScript': `function solveNQueens(n) {
    // Write your code here
    
}`,
      'Python': `def solve_n_queens(n):
    # Write your code here
    pass`,
      'Java': `class Solution {
    public List<List<String>> solveNQueens(int n) {
        // Write your code here
        return new ArrayList<>();
    }
}`,
      'C++': `class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        // Write your code here
        return {};
    }
}`
    },
    tests: [
      { input: '4', expected: '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]' },
      { input: '1', expected: '[[\"Q\"]]' }
    ],
    coinsReward: 40,
    xpReward: 200,
    hints: [
      'Use backtracking, placing one queen per row.',
      'Maintain sets of occupied columns, diagonals, and anti-diagonals to query constraints in O(1) time.'
    ],
    editorial: `### N-Queens - Editorial

This is solved using Depth-First-Search Backtracking.

#### Algorithm:
1. Backtrack row-by-row.
2. For each column from \`0\` to \`N-1\`:
   - Calculate diagonal index: \`(row - col)\`.
   - Calculate anti-diagonal index: \`(row + col)\`.
   - If column, diagonal, or anti-diagonal is already occupied, skip.
   - Place queen, add columns/diagonals to occupied sets, recurse on row + 1.
   - Backtrack by removing queen and removing columns/diagonals from sets.

#### Complexity:
- **Time Complexity**: **O(N!)** as there are N choices for first row, N-2 for second, etc.
- **Space Complexity**: **O(N^2)** for storing boards and recursive recursion stacks.`
  }
];

// Helper to generate the remaining problems programmatically up to exactly 50 per level
function generateProblems(): Problem[] {
  const problems: Problem[] = [...baseProblems];
  
  const tags = [
    'Arrays', 'Strings', 'Math', 'Recursion', 'Sorting',
    'Linked List', 'Stack', 'Queue', 'Dynamic Programming',
    'Graphs', 'Trees', 'Backtracking', 'Hash Maps'
  ];
  
  const levels: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
  
  levels.forEach((lvl) => {
    const currentList = baseProblems.filter(p => p.level === lvl);
    const needed = 50 - currentList.length;
    
    for (let i = 1; i <= needed; i++) {
      const id = `${lvl.toLowerCase()}-task-${i}`;
      const title = `${lvl} Task #${i}`;
      const tag = tags[i % tags.length];
      const diff: Difficulty = i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard';
      const category = lvl === 'Beginner' ? 'Programming Basics' : lvl === 'Intermediate' ? 'Data Structures' : 'Algorithms';
      
      const coinsReward = lvl === 'Beginner' ? 10 : lvl === 'Intermediate' ? 20 : 40;
      const xpReward = lvl === 'Beginner' ? 50 : lvl === 'Intermediate' ? 100 : 200;
      
      const jsFuncName = id.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
      const pyFuncName = id.replace(/-/g, '_');
      
      problems.push({
        id,
        title,
        level: lvl,
        difficulty: diff,
        category,
        tag,
        description: `### challenge task
Complete the function \`${jsFuncName}(n)\` to return the double value of input integer \`n\`.

This tracks core coding skills for ${tag} in ${lvl} level.`,
        constraints: [
          '0 <= n <= 10^5'
        ],
        examples: [
          {
            input: 'n = 5',
            output: '10'
          }
        ],
        boilerplate: {
          'JavaScript': `function ${jsFuncName}(n) {
    // Return double of n
    return n * 2;
}`,
          'Python': `def ${pyFuncName}(n):
    # Return double of n
    return n * 2`,
          'Java': `class Solution {
    public int ${jsFuncName}(int n) {
        return n * 2;
    }
}`,
          'C++': `class Solution {
public:
    int ${jsFuncName}(int n) {
        return n * 2;
    }
}`
        },
        tests: [
          { input: '5', expected: '10' },
          { input: '12', expected: '24' }
        ],
        coinsReward,
        xpReward,
        hints: [
          `Multiply the argument n by 2.`,
          `This is a quick O(1) basic arithmetic computation.`
        ],
        editorial: `### ${title} Editorial

Return \`n * 2\` to successfully pass all compile checks.`
      });
    }
  });
  
  return problems;
}

export const initialProblems: Problem[] = generateProblems();
