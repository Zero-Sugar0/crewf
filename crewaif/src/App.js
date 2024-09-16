import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_ENDPOINT = 'https://mcrew.onrender.com/crewai';

const AgentCard = ({ agent, status }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-primary">{agent.role}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground font-medium">{agent.name}</p>
      <p className="mt-2 text-sm">{agent.backstory.substring(0, 100)}...</p>
      <div className="agent-status">
        {status === 'working' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        {status === 'complete' && <CheckCircle2 className="h-4 w-4 text-secondary" />}
        <span className="ml-2 text-sm capitalize">{status}</span>
      </div>
    </CardContent>
  </Card>
);

const ResultTab = ({ title, content }) => (
  <div className="mt-4">
    <h3 className="font-bold text-lg text-primary">{title}</h3>
    <Card className="mt-2">
      <CardContent>
        <pre className="result-content">{content}</pre>
      </CardContent>
    </Card>
  </div>
);

const CrewAIAgentsDashboard = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [mainProducts, setMainProducts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [agentStatuses, setAgentStatuses] = useState({
    researcher: 'idle',
    competitor_analyst: 'idle',
    content_writer: 'idle',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);
    setAgentStatuses({
      researcher: 'working',
      competitor_analyst: 'idle',
      content_writer: 'idle',
    });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName, industry, mainProducts }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const data = await response.json();
      setResults(data);
      setAgentStatuses({
        researcher: 'complete',
        competitor_analyst: 'complete',
        content_writer: 'complete',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const agents = [
    { role: 'Senior Market Research Specialist', name: 'Dr. Amelia Thornton', backstory: 'A renowned market research specialist with over 20 years of experience across various industries...' },
    { role: 'Elite Competitive Intelligence Strategist', name: 'Marcus Chen', backstory: 'A highly sought-after competitive intelligence strategist with a track record of helping companies outmaneuver their rivals...' },
    { role: 'Visionary Content Strategist and Master Storyteller', name: 'Sophia Rodriguez', backstory: 'A globally recognized content strategist and brand storyteller whose work has redefined digital marketing and corporate communications...' },
  ];

  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-8">CrewAI Agents Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="input"
          />
          <Input
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            required
            className="input"
          />
          <Input
            placeholder="Main Products/Services"
            value={mainProducts}
            onChange={(e) => setMainProducts(e.target.value)}
            required
            className="input"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="button w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Run Analysis'
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {agents.map((agent, index) => (
          <AgentCard
            key={index}
            agent={agent}
            status={agentStatuses[Object.keys(agentStatuses)[index]]}
          />
        ))}
      </div>

      {results && (
        <Tabs defaultValue="research" className="tabs">
          <TabsList className="mb-4">
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="competitor">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="content">Blog Post</TabsTrigger>
          </TabsList>
          <TabsContent value="research">
            <ResultTab title="Research" content={results.research} />
          </TabsContent>
          <TabsContent value="competitor">
            <ResultTab title="Competitor Analysis" content={results.competitorAnalysis} />
          </TabsContent>
          <TabsContent value="content">
            <ResultTab title="Blog Post" content={results.blogPost} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CrewAIAgentsDashboard;