package com.springgithub.springgithub.services.github;

import com.springgithub.springgithub.config.Configuration;
import com.springgithub.springgithub.data.GithubData;
import com.springgithub.springgithub.data.TestData;
import com.springgithub.springgithub.repositories.TestRepository;
import com.springgithub.springgithub.services.github.validators.GithubUserValidator;
import com.springgithub.springgithub.model.Repo;
import com.springgithub.springgithub.model.User;
import org.bson.types.ObjectId;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.client.PageIterator;
import org.eclipse.egit.github.core.service.CommitService;
import org.eclipse.egit.github.core.service.OrganizationService;
import org.eclipse.egit.github.core.service.RepositoryService;
import org.eclipse.egit.github.core.service.WatcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.info.ProjectInfoProperties;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.*;

@EnableMongoRepositories(basePackageClasses = TestRepository.class)
@Service
public class CustomGithubService {

    private RestTemplate restTemplate;
    private HttpHeaders headers;

    public CustomGithubService() {
        restTemplate = new RestTemplate();
    }

    // Get basic info of a user.
    @Cacheable("user")
    public User getUser(String username) {
        GithubUserValidator githubUserValidator = new GithubUserValidator();
        githubUserValidator.setFound(true);
        restTemplate = new RestTemplate();
        restTemplate.setErrorHandler(githubUserValidator);
        headers = new HttpHeaders();
        headers.set("User-Agent", "profile-analyzer");
        HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);
        ResponseEntity<User> user = restTemplate.exchange("https://api.github.com/users/"+ username +
                        "?client_id=" + Configuration.GITHUB_CLIENT_ID + "&client_secret=" + Configuration.GITHUB_CLIENT_SECRET,
                HttpMethod.GET, entity, User.class);
        user.getBody().setValidated(githubUserValidator.isFound());
        return user.getBody();
    }

    // Get top 30 repositories
    public Repo[] getRepo(String username) {
        GithubUserValidator githubUserValidator = new GithubUserValidator();
        restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.set("User-Agent", "profile-analyzer");
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
        ResponseEntity<Repo[]> repository = restTemplate.exchange("https://api.github.com/users/"+ username +
                        "/repos" + "?per_page=100&client_id=" + Configuration.GITHUB_CLIENT_ID + "&client_secret=" + Configuration.GITHUB_CLIENT_SECRET,
                HttpMethod.GET, entity, Repo[].class);
        return repository.getBody();
    }

    // Get a map with <Repository, Commits>
    @Cacheable("commits")
    public Map getCommitsAdaptorRe(String username){

        Map<String, Integer> map = new HashMap<>();

        try {
            GitHubClient client = new GitHubClient();
            client.setOAuth2Token(Configuration.GITHUB_TOKEN);
            RepositoryService repositoryService = new RepositoryService(client);
            CommitService commitService = new CommitService(client);

            PageIterator<Repository> pageIterator = repositoryService.pageRepositories(username, 1, 10);

            for (Repository repository: pageIterator.iterator().next()) {

                if(!repository.isFork()) {
                    map.put(repository.getName(), commitService.getCommits(repository).size());
                }

            }
        } catch (IOException e) {
            map.put("NO DATA", 0);
        }

        if(map.size() == 0) {

        }

        return map;
    }

    // Get starts per Language
    public ArrayList<Object> getStarsPerLang(String username) {
    	
    	GithubUserValidator githubUserValidator = new GithubUserValidator();

        ArrayList<Object> output = new ArrayList<>();
        ArrayList<String> languages = new ArrayList<>();
        ArrayList<Integer> star_counts = new ArrayList<>();

        String URL = "https://api.github.com/users/" + username + "/starred?client_id=" + Configuration.GITHUB_CLIENT_ID
                + "&client_secret=" + Configuration.GITHUB_CLIENT_SECRET;

        restTemplate = new RestTemplate();
        restTemplate.setErrorHandler(githubUserValidator);
        headers = new HttpHeaders();
        headers.set("User-Agent", "profile-analyzer");
        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        ResponseEntity<Repo[]> repos = restTemplate.exchange(URL, HttpMethod.GET, entity, Repo[].class);

        // JSON Parse error is caused by this line.
        Repo[] arr = repos.getBody();

        for (Repo repo : arr) {
            languages.add(repo.getLanguage());
        }

        // Remove Duplicates
        languages = new ArrayList<String>(new LinkedHashSet<String>(languages));

        if(languages.contains(null)) {
            languages.set(languages.indexOf(null), "Other");
        }

        // Synthesize output.
        for(String language : languages) {
            int count = 0;
            for(Repo repo: arr){
                if(Objects.equals(repo.getLanguage(), language)){
                    count++;
                }
            }
            star_counts.add(count);
        }

        output.add(languages);
        output.add(star_counts);

        return output;

    }

    // Get the total amount of forks
    public ArrayList<Object> getForks(String username) {

        ArrayList<Object> output = new ArrayList<>();
        ArrayList<Repository> forkedRepos = new ArrayList<>();
        ArrayList<String> languages = new ArrayList<>();
        ArrayList<Integer> forkCounts = new ArrayList<>();

        GitHubClient client = new GitHubClient();
        client.setOAuth2Token(Configuration.GITHUB_TOKEN);
        RepositoryService repositoryService = new RepositoryService(client);
        List<Repository> repos = null;

        try {
            repos = repositoryService.getRepositories(username);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Get forked repos
        for(Repository repo: repos) {
            if(repo.isFork()) {
                forkedRepos.add(repo);
                languages.add(repo.getLanguage());
            }
        }

        // Set null language to other
        if(languages.contains(null)) {
            languages.set(languages.indexOf(null), "Other");
        }

        // Remove Duplicates
        languages = new ArrayList<String>(new LinkedHashSet<String>(languages));

        for (String language: languages){
            int count = 0;
            for(Repository forkedRepo: forkedRepos) {
                if(Objects.equals(forkedRepo.getLanguage(), language)) count++;
            }
            forkCounts.add(count);
        }

        // Synthesize the output
        output.add(languages);
        output.add(forkCounts);

        return output;
    }

    // Get total amount of watchers.
    public Integer getWatchers(String username) {

        int watchers = 0;

        GitHubClient gitHubClient = new GitHubClient();
        gitHubClient.setOAuth2Token(Configuration.GITHUB_TOKEN);

        WatcherService watcherService = new WatcherService(gitHubClient);

        List<Repository> repositories = new ArrayList<>();

        try {
            repositories = watcherService.getWatched(username);
        } catch (IOException e) {
            e.printStackTrace();
        }

        watchers = repositories.size();

        return watchers;
    }

    // Get total amount of issues
    public Integer getIssues(String username) {

        int issue_count = 0;

        GitHubClient gitHubClient = new GitHubClient();
        gitHubClient.setOAuth2Token(Configuration.GITHUB_TOKEN);
        List<Repository> repositories = new ArrayList<>();
        RepositoryService repositoryService = new RepositoryService(gitHubClient);

        try {
            repositories = repositoryService.getRepositories(username);
        } catch (IOException e) {
            e.printStackTrace();
        }

        for (Repository repository: repositories) {
            if(repository.isHasIssues()) issue_count++;
        }

        return issue_count;
    }

    // Get total amount of organizations
    public Integer getOrganizations(String username) {

        int organization_count = 0;

        GitHubClient gitHubClient = new GitHubClient();
        gitHubClient.setOAuth2Token(Configuration.GITHUB_TOKEN);
        List<org.eclipse.egit.github.core.User> organizations = new ArrayList<>();
        OrganizationService organizationService = new OrganizationService(gitHubClient);

        try {
            organizations = organizationService.getOrganizations(username);
        } catch (IOException e) {
            e.printStackTrace();
        }

        organization_count = organizations.size();

        return organization_count;
    }

}
