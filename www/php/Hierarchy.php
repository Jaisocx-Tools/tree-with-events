<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation as Serializer;
use Symfony\Component\Validator\Constraints as Assert;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Hierarchy
 *
 * @ORM\Table(name="hierarchy")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\HierarchyRepository")
 */
class Hierarchy
{

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Hierarchy", mappedBy="parents")
     * @ORM\JoinColumn(name="id", referencedColumnName="parent_id")
     * @ORM\OrderBy({"position" = "ASC"})
     * @Serializer\Groups({"default"})
     */
    private $subtree;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Hierarchy", inversedBy="subtree")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id")
    */
    private $parents;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Serializer\Groups({"default"})
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="parent_id", type="integer")
     * @Serializer\Groups({"default"})
     */
    private $parentId;

    /**
     * @var int
     * @Gedmo\SortablePosition()
     * @ORM\Column(name="position", type="integer")
     * @Serializer\Groups({"default"})
     */
    private $position;

    /**
     * @var bool
     *
     * @ORM\Column(name="opened", type="boolean")
     * @Serializer\Groups({"default"})
     */
    private $opened;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     * @Serializer\Groups({"default"})
     */
    private $title;

    /**
     * @var string|null
     *
     * @ORM\Column(name="href", type="string", length=255, nullable=true)
     * @Serializer\Groups({"default"})
     */
    private $href;

    /**
     * @var string|null
     *
     * @ORM\Column(name="icon", type="string", length=255, nullable=true)
     * @Serializer\Groups({"default"})
     */
    private $icon;


    public function __construct()
    {
        $this->subtree = new ArrayCollection();
    }

    public function getSubtree(){
        return $this->subtree;
    }
    public function setSubtree($subtree){
        $this->subtree = $subtree;
        return $this;
    }
    public function getParents(){
        return $this->parents;
    }
    public function setParents(Hierarchy $parents){
        $this->parents = $parents;
        return $this;
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set parentId.
     *
     * @param int $parentId
     *
     * @return Hierarchy
     */
    public function setParentId($parentId)
    {
        $this->parentId = $parentId;

        return $this;
    }

    /**
     * Get parentId.
     *
     * @return int
     */
    public function getParentId()
    {
        return $this->parentId;
    }

    /**
     * Set position.
     *
     * @param int $position
     *
     * @return Hierarchy
     */
    public function setPosition($position)
    {
        $this->position = $position;

        return $this;
    }

    /**
     * Get position.
     *
     * @return int
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * Set opened.
     *
     * @param bool $opened
     *
     * @return Hierarchy
     */
    public function setOpened($opened)
    {
        $this->opened = $opened;

        return $this;
    }

    /**
     * Get opened.
     *
     * @return bool
     */
    public function getOpened()
    {
        return $this->opened;
    }

    /**
     * Set title.
     *
     * @param string $title
     *
     * @return Hierarchy
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set href.
     *
     * @param string|null $href
     *
     * @return Hierarchy
     */
    public function setHref($href = null)
    {
        $this->href = $href;

        return $this;
    }

    /**
     * Get href.
     *
     * @return string|null
     */
    public function getHref()
    {
        return $this->href;
    }

    /**
     * Set icon.
     *
     * @param string|null $icon
     *
     * @return Hierarchy
     */
    public function setIcon($icon = null)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * Get icon.
     *
     * @return string|null
     */
    public function getIcon()
    {
        return $this->icon;
    }
}
